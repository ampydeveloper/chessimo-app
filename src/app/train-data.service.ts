import { AppService } from './app.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrainDataService {

  CHO_CAT_ALL = -1;
  CHO_CAT_TACTICS = 0;
  CHO_CAT_STRATEGY = 1;
  CHO_CAT_ENDGAME = 2;
  CHO_CAT_COMMENTED_ENDGAME = 3;
  CHO_CAT_OPENING = 4;

  //Data Files
  TrainMeta: any = {};
  UnitMaps: any = {};
  gamedata: Array<any> = [];

  OverAllPercentage = 0;
  SolvedExeByCat:any = [];
  TotalExeByCat: any = [];
  // History
  HistoryExe: any = null;

  //ServerData
  serverData = {};

  Units: any = [];

  constructor(public appService: AppService) { }

  loadData() {

    fetch('./assets/chess/traindata/trainfile_meta.json').then(res => res.json())
      .then(json => {
        this.TrainMeta = json;
      });

    fetch('./assets/chess/traindata/trainunitmapping.json').then(res => res.json())
      .then(json => {
        this.UnitMaps = json;
        this.getSolvedExercisesPercentOverall();
      });

    fetch('./assets/chess/traindata/Games.json').then(res => res.json())
    .then(json => {
      this.gamedata = json;
    });

    setTimeout(() => {
      this.loadCatUnits();
    }, 2000)
  }

  loadCatUnits() {

    for(let x = 0; x < 5; x++)
    {
      let modules = this.getModuleCount(x);
     
      let Units = [];
      for(let i = 0; i < modules; i++ )
      {
        Units.push({id: i, name: this.getNameOfModule(x, i), units: 0});
        Units[i].units = Array(this.getUnitCount(x, i)).fill(0).map((a,i)=>i); 
      }
  
      this.Units[x] = Units;
    }
   
  }

  getUnit(category, module, unit) {
    return new Promise( (resolve, reject) => {
      let Exe = [];
      let getUnitFiles = (category, module, unit) => {
  
        let ret = [];
        switch (category) {
          case this.CHO_CAT_TACTICS:
          case this.CHO_CAT_STRATEGY:
          case this.CHO_CAT_ENDGAME:
    
            let mapping = this.UnitMaps[category];
            ret = [];
            let modFolder = mapping['' + (module + 1)];
            var unitMapping = this.UnitMaps['Unit' + (unit + 1)];
            unitMapping.forEach(function (exe) {
              ret.push(modFolder + '/' + exe);
            });
            break;
          case this.CHO_CAT_OPENING:
          case this.CHO_CAT_COMMENTED_ENDGAME:
            var filename = this.UnitMaps[category][(module + 1)][(unit + 1)];
            ret = [];
            ret.push(filename);
            break;
        }
  
        if (Array.isArray(ret)) ret.reverse();
        return ret;
      }
      
      let Files = getUnitFiles(category, module, unit);
  
      let exeFile = (file) => {
        return fetch('./assets/chess/traindata/'+file+'.json').then(res => res.json());
      }
  
    
      let startloading = (Files) => {
        let nextFile = Files.pop();
        exeFile(nextFile).then( data => {
          data.forEach(d => {
            Exe.push(d);
          });
          if(Files.length == 0) 
          {
              resolve(Exe);
          } else {
            startloading(Files);
          }
        });
      }

      startloading(Files);
    });
    
  }

  getLocalUnit(l) {
    let key = l.category + "-" + l.module + "-" + l.unit;
    // console.log(key);
    let res = localStorage.getItem(key);
    if(res != null) {
       return JSON.parse(res); 
    }
    return null; 
  }

  saveLocalUnit(l, ExeHostoryList) {
    let key = l.category + "-" + l.module + "-" + l.unit;
    localStorage.setItem(key, JSON.stringify(ExeHostoryList));
  }



  ///////////////////// Total ///////////////

  getExerciseCount(category, module, unit) {
    let count = 0;

      switch (category) {
          case 0:
            var unitMapping = this.UnitMaps["Unit"+(unit+1)];
            count = 15 * Object.keys(unitMapping).length;
            break;
          case 1:
            var unitMapping = this.UnitMaps["Unit"+(unit+1)];
            count = 5 * Object.keys(unitMapping).length;
            break;
          case 2:
            var unitMapping = this.UnitMaps["Unit"+(unit+1)];
            count = 10 * Object.keys(unitMapping).length;
              break;
          case 3:
            switch(unit) {
              case 0: count = 38; break;
              case 1: count = 59; break;
              case 2: count = 52; break;
              case 3: count = 43; break;
              case 4: count = 8; break;
            }
            break;
          case 5:
          {
            count = 1;
              break;
          }
      }
      return count;
  }

  getUnitCount(category, module) {
    var count = 0;
      switch (category) {
          case 0:
          case 1:
          case 2:
              count = 50;
              break;
          case 3:
          case 4:
          {
            var catMapping = this.UnitMaps[""+category];
            var moduleMapping = catMapping[""+(module+1)];
              count = Object.keys(moduleMapping).length;
              break;
          }
      }
      return count;
  }

  getExerciseCountOfModule(cat, module): any {
    var ret = 0;
    var unitCount = this.getUnitCount(cat, module);
    for(var u=0;u<unitCount;u++) {
      ret += this.getExerciseCount(cat, module, u);
    }
      return ret;
  }

  getModuleCount(category) {
    var catMapping = this.UnitMaps[""+category];
    return Object.keys(catMapping).length;
  }

  getExerciseCountOfCategory(cat): any {
    var moduleCount = this.getModuleCount(cat);

    var ret = 0;
      for(var m=0;m<moduleCount;m++) {
      ret += this.getExerciseCountOfModule(cat, m);
    }
    return ret;
  }

  getExerciseCountOverall() {
    var ret = 0;
    for(var cat=0;cat<5;cat++) {
      ret += this.TotalExeByCat[cat] =  this.getExerciseCountOfCategory(cat);
    }
    return ret;
  }

  //////////////Soleved /////////////

  getCurrentUnitExercise(cat, mod, unit, retTrue) {
		let exerciseCount = this.getExerciseCount(cat,mod,unit);
    let ret: any = 0;

    var key = cat+'-'+mod+'-'+unit;
    let exe = localStorage.getItem(key);

    if(exe != null) {
      for(var i=0;i<exerciseCount;i++) {
        var key = cat+'-'+mod+'-'+unit;
        if(exe[i] == null || typeof exe[i] == 'undefined')
        {
            break;
        } else {
          var studyTime = exe[i];
          if (studyTime !== null) {
            ret = i+1;
          } else {
            break;
          }
        }
      }
    }
    
		if (ret >= exerciseCount && retTrue == true) {
			ret = true;
		}
		return ret;
  }
  
  getSolvedExercises(cat) {
      var ret = 0;
      var modCount = this.getModuleCount(cat);
      for(var m=0;m<modCount;m++) {
        var unitCount = this.getUnitCount(cat,m);
        for(var u=0;u<unitCount;u++) {
          ret += this.getCurrentUnitExercise(cat,m,u,false);
        }
      }
  
      return ret;
  }
  

  getSolvedExercisesOverall() {
    var ret = 0;
		for(var cat=0;cat<5;cat++) {
			ret += this.SolvedExeByCat[cat] =  this.getSolvedExercises(cat);
		}
		return ret;
  }

  getSolvedExercisesPercentOverall() {
    var overall = this.getExerciseCountOverall();
  
    var solved = this.getSolvedExercisesOverall();
		var ret = solved/overall;
		if (ret > 1.0) {
			ret = 1.0;
    }
    
    
    this.OverAllPercentage = ret * 100;

    let indexArray = {'tactics': 0, 'strategies': 1, 'endgames': 2, 'commentedEndgames':3, 'openings': 4};
    let trainings = this.appService.gameTypes.train.trainings;

    // console.log(this.SolvedExeByCat, this.TotalExeByCat);
    for(let t in  trainings)
    {
      let per = Math.floor(this.SolvedExeByCat[indexArray[t]] / this.TotalExeByCat[indexArray[t]] * 100);
      if(isNaN(per)) per = 0;
      trainings[t].percentage = per; 
    }
  }

  /////////////////////////////////////////////////////////////////

  getFilenamesForUnit(category, module, unit) {
    // console.log('getFilenamesForUnit('+category+','+module+','+unit+')');
    var ret = null;
    switch(category) {
    case 0:
    case 1:
    case 2:
      var mapping = this.UnitMaps[category];
      ret = [];
      var modFolder = mapping[''+(module+1)];
      var unitMapping = this.UnitMaps['Unit'+(unit+1)];
      unitMapping.forEach(function(exe) {
        ret.push(modFolder+'/'+exe);
      });
      break;
    case 3:
    case 4:
      var filename = this.UnitMaps[category][(module+1)][(unit+1)];
      ret = [];
      ret.push(filename);
      break;
    }
    return ret;
  }

  getLangCodeArray(lang) {
    lang = lang.toLowerCase();
    var ret = [];
    ret.push(lang);
    // example: if (lang == 'cz') {ret.push('ru');}
    if (lang != 'en') {ret.push('en');} // Always add english as default
    return ret;
  }

  getNameOfUnit(category, module, unit) {
    var ret = null;
    switch(category) {
    case 4:
      var filename = this.getFilenamesForUnit(category, module, unit)[0];
      var catTrainfileMetaData = this.TrainMeta[""+category];
      if (catTrainfileMetaData !== undefined) {
        var meta = catTrainfileMetaData[filename];
        if (meta !== undefined && meta.event !== undefined) {
          var langCodeArr = this.getLangCodeArray('en');
          for(var i=0;i<langCodeArr.length;i++) {
            ret = meta.event[langCodeArr[i]];
            if (ret !== undefined) {
              break;
            }
          }
        }
      }
      break;
    }
    if (ret === null) {
      ret = 'Unit ' + (Number(unit)+1);
    }
    return ret;
  }

  getNameOfModule(category, module) {
    var ret = null;
    switch(category) {
    case this.CHO_CAT_OPENING:
      var catTrainfileMetaData = this.TrainMeta[""+category];
      if (catTrainfileMetaData !== undefined) {
        var meta = catTrainfileMetaData["mod"+(module+1)];
        if (meta !== undefined && meta.title !== undefined) {
          var langCodeArr = this.getLangCodeArray('en');
          for(var i=0;i<langCodeArr.length;i++) {
            ret = meta.title[langCodeArr[i]];
            if (ret !== undefined) {
              break;
            }
          }
        }
      }
      break;
    }
    if (ret === null) {
      ret = 'Module '+ (module+1);
    }
    return ret;
  }


}
