import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class EloService {

    aiMapping = [
        {lvl:0, elo:850}, // Mapping Johannes
        {lvl:1, elo:950},
        {lvl:2, elo:1050},
        {lvl:3, elo:1250},
        {lvl:4, elo:1500},
        {lvl:5, elo:1550},
        {lvl:6, elo:1600},
        {lvl:7, elo:1700},
        {lvl:8, elo:1850},
        {lvl:9, elo:1950},
        {lvl:10, elo:2000},
        {lvl:11, elo:2100},
        {lvl:12, elo:2250},
        {lvl:13, elo:2300}, // Rest Inserted by TK +50 steps
        {lvl:14, elo:2350},
        {lvl:15, elo:2400},
        {lvl:16, elo:2450},
        {lvl:17, elo:2500},
        {lvl:18, elo:2550},
        {lvl:19, elo:2600},
        {lvl:20, elo:2650}
       ];
       
	constructor() { }

	suiteELO(elo) {
		if (elo < 500) {
			elo = 500;
		}
		return elo;
	}

	getELO() {
		var ret: any = localStorage.getItem('elo');
		if (ret == '' || !ret) {
			ret = 500;
		} else {
			ret = parseInt(ret);
			if (isNaN(ret)) {
				ret = 500;
			}
		}
		return this.suiteELO(ret);
	}

	updateELO(elo) {
		if (elo == null || elo == undefined) {
			elo = 500;
		}
		elo = parseInt(elo);
		elo = this.suiteELO(elo);
		// insert into history and update current elo state
		// let dateString = (new Date()).toDateString();
		// console.log("data string", dateString);
		// let date = dateString.replace(/ /g,"T");
		this.insertELOHistory(new Date(), elo);
		localStorage.setItem('elo', elo);
	}

	getELOHistory() {
		var ret = [];
		let list: Array<any> = this.getStorageEntries('eloh.');
		// console.log("store list", list);
		if(list != null)
		{
			for (var i = 0; i < list.length; i++) {
				var h = list[i];
				var dateStr = h.key.substring(5);
				// console.log(dateStr);
		
				
				// var dateObj = new Date(dateStr);
				var dateObj =  new Date(dateStr.replace(/-/g, "/"));

				//var dateObj = moment(dateStr, 'YYYY-MM-DD').toDate();
				// console.log(dateObj);
				var elo = parseInt(h.value);
				var entry = { x: dateObj, y: elo };
				ret.push(entry);
			}
		}
		return ret;
	}

	getStorageEntries(keyPrefix) { // [{key:key, value:value}]
		let ret = [];
		let lslen = localStorage.length;
		for(let i=0;i<lslen;i++) {
			let key = localStorage.key(i);
			if (key.startsWith(keyPrefix)) {
				let value = localStorage.getItem(key);
				ret.push({key:key, value:value});
			}
		}
		return ret;
	}

	insertELOHistory(dateObj, elo) {
		if (dateObj === undefined || elo === undefined) {
			throw "Date or elo not specified!";
		}
		elo = this.suiteELO(elo);
		var key = 'eloh.' + dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
		localStorage.setItem(key, '' + elo);
		return key;
	}

	setELO(result: 1 | 0 | 0.5) {
		console.log('setELO result', result);
		var user_rating_old= this.getELO();
		var user_level = this.getKILevelBasedOnELO(user_rating_old);
		var newELO = this.calcElo(user_rating_old, user_level, result);
        this.updateELO(newELO);
	}

	///////////////
	calcElo_OLD(own,opp,result)
    {
        if(!(result==0.0 || result==0.5 || result==1.0)) {
        	throw "Invalid result "+result;
        }

        var ownElo=own;
        var oppElo=opp;

        var factor =(3400-ownElo)*(3400-ownElo)/100000;
        var eloDiff = ownElo-oppElo;
        var absEloDiff = Math.abs(eloDiff);

        var x0=.5;
        var x1=.0014217;
        var x2=-.00000024336;
        var x3=-.000000002514;
        var x4=.000000000001991;

        var expectation;
        if (absEloDiff>735) {
            expectation = 1;
        } else {
            expectation=x0+x1*absEloDiff+x2*absEloDiff*absEloDiff+x3*absEloDiff*absEloDiff*absEloDiff+x4*absEloDiff*absEloDiff*absEloDiff*absEloDiff;
        }

        if (eloDiff<0) {
            expectation = 1-expectation;
        }

        var gain = factor*(result-expectation);
        var newElo = ownElo+gain;

        return newElo;

	}

    calcElo(user_rating_old, engine_level, result) {
        if (!(result == 0 || result == 0.5 || result == 1)) {
            throw "Invalid result " + result;
        }
        let engine_rating = this.level_to_er(engine_level);
        let user_rating_new = user_rating_old;

        let performance_rating = 0;
        if (result === 1) {
            performance_rating = engine_rating + 200;
            user_rating_new = (performance_rating - user_rating_old) / 2 + user_rating_old;
        }
        else if (result === 0) {
            performance_rating = engine_rating - 100;
            let abs = performance_rating - user_rating_old;
            if (abs < 0) abs *= -1;
            user_rating_new = user_rating_old - abs / 2;
        }

        if (user_rating_new < 500) user_rating_new = 500;
        return user_rating_new;

	}
	
    er_to_level(elo) {
        if (elo <= 500) return 0;
        elo -= 500;
        if (elo <= 500) return 0;
        var level = Math.floor(elo / 120);
        if (level <= 0) return 0;
        if (level > 20) return 20;

        return level;
	}
	
    level_to_er(level) {
        //if (level <= 0) return 850;
        if (level <= 0) return 500;
        var rating = level * 120 + 500;
        if (rating > 3000) return 3000;
        if (rating < 500) return 500;
        return rating;
    }

    getKILevelBasedOnELO(elo = undefined) {
    	var curELO;
    	if (elo !== undefined) {
    		curELO = elo;
    	} else {
    		curELO = this.getELO(); // e.g. 600
    	}
    	var map = this.aiMapping;
    	var level = 0;
    	for(var i=0;i<map.length;i++) {
    		var eloLevel = map[i];
    		if (curELO >= eloLevel.elo) {
    			level = eloLevel.lvl+1;
    		} else {
    			break;
    		}
    	}
    	if (level > 20) {level = 20;}
    	return level;
	}
	
    getKIELOBasedOnELO(elo = undefined) {
    	let level = this.getKILevelBasedOnELO(elo);
    	let map = this.aiMapping;
    	for(let i=0; i < map.length; i++) {
    		let eloLevel = map[i];
    		if (level == eloLevel.lvl) {
    			return eloLevel.elo;
    		}
    	}
    	return -1;
	}
}
