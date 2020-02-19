
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { UserService } from '../user.service';
import { UserConnectService } from '../user-connect.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OptionsPage implements OnInit {

  constructor(public appService: AppService, 
              public userService: UserService, 
              public userConnectService: UserConnectService) { 
    
  }

  boardSets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  pieceSets = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  ngOnInit() {
    
  }

  arraySearch(arr,val) {
   
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        return i;
      }                   
    }      
    return false;
  }

  selectNextBoardSet() {
    let key: any = this.arraySearch(this.boardSets, this.userService.gameSetting.boardSet);
    if(key === false || typeof(this.boardSets[key+1]) == 'undefined'){
      this.userService.gameSetting.boardSet = this.boardSets[0];
    } else {
      this.userService.gameSetting.boardSet = this.boardSets[key+1];
    }

    this.userConnectService.saveField('chess_board', this.userService.gameSetting.boardSet);
  }

  selectPreBoardSet() {
    let key: any = this.arraySearch(this.boardSets, this.userService.gameSetting.boardSet);
    if(key === false || typeof(this.boardSets[key-1]) == 'undefined'){
      this.userService.gameSetting.boardSet = this.boardSets[this.boardSets.length -1];
    } else {
      this.userService.gameSetting.boardSet = this.boardSets[key-1];
    }

    this.userConnectService.saveField('chess_board', this.userService.gameSetting.boardSet);
  }

  selectNextPieceSet() {
    let key: any = this.arraySearch(this.pieceSets, this.userService.gameSetting.pieceSet);
    if(key === false || typeof(this.pieceSets[key+1]) == 'undefined'){
      this.userService.gameSetting.pieceSet = this.pieceSets[0];
    } else {
      this.userService.gameSetting.pieceSet = this.pieceSets[key+1];
    }

    this.userConnectService.saveField('figure_set', this.userService.gameSetting.pieceSet);

    console.log(this.userService.gameSetting);
  }

  selectPrePieceSet() {
    let key: any = this.arraySearch(this.pieceSets, this.userService.gameSetting.pieceSet);
    if(key === false || typeof(this.pieceSets[key-1]) == 'undefined'){
      this.userService.gameSetting.pieceSet = this.pieceSets[this.pieceSets.length -1];
    } else {
      this.userService.gameSetting.pieceSet = this.pieceSets[key-1];
    }

    this.userConnectService.saveField('figure_set', this.userService.gameSetting.pieceSet);
    console.log(this.userService.gameSetting);
  }

}
