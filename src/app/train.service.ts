import { SoundService } from './sound.service';
import { UserConnectService } from './user-connect.service';
import { Injectable } from '@angular/core';
import { Timer, ReverseTimer } from './gameboard/classes/timer';
import { timer } from 'rxjs';
import { TrainDataService } from './train-data.service';
import { UserService } from './user.service';
import { PgnService } from './pgn.service';
import { TraingamePage } from './home/trainoverview/trainunits/traingame/traingame.page';

declare var $, Chess;
@Injectable({
  providedIn: 'root'
})
export class TrainService {

  // Nessacary to define
  cfg: any = {};
  Paused = false;
  waitForSelection = false;
  
  initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  gameboard: any = {};

  view: TraingamePage;
  game: any = null;
  board: any;
  character = '';

  commentResolve:any = {};
  isshowcomment = false;

  timer: any = {
    unitTimer: new Timer,
    exeTimer: new ReverseTimer
  }

  Counter: any = null;
  CounterFn: any = null;
  isRunning = false;


  turn: any = 'own';

  // default parameters
  own = {
    time: 5,
    extra_time: 1,
    color: "white",
    name: 'Player 1'
  };


  instruction = 'Instruction X';
  timePerExercise = "--:--";

  $CMU: any = null;

  ExeList: Array<any> = [];
  ExeHistoryList = null;

  gameState: {
    index,
    timeperexper,
    unitTimer,
    exeTimer,
  } = {
      index: 0,
      timeperexper: "--:--",
      unitTimer: 0,
      exeTimer: 0,
    };

  tpxLimit: any = 300;


  constructor(public trainData: TrainDataService, public userService: UserService, public pgn: PgnService, public connect: UserConnectService, public soundService: SoundService) {
    this.tpxLimit = this.userService.trainingSetting.timeperexper;
  }

  // Nessacary to define
  init() {
    // init cfg 
    this.cfg.orientation = 'white'; // white || black;
    this.cfg.showNotation = false; // false || true;
    this.cfg.draggable = true;
    this.cfg.dropOffBoard = 'snapback'; // snapback | trash;
    this.cfg.sparePieces = false;
    this.cfg.position = 'start';

    // reset Timer
    this.timer.unitTimer.reset();
    this.timer.exeTimer.reset();

    this.tpxLimit = Number(this.userService.trainingSetting.trainTimePerExercise) * 60;
    this.timer.exeTimer.init(this.tpxLimit);

    this.game = new Chess();
  }

  loadExe(l) {
    this.$CMU = l;

    this.connect.getExe({ theme_number: l.category, module_number: l.module });

    return new Promise((resolve, reject) => {
      //trainData
      let unit = this.trainData.getUnit(l.category, l.module, l.unit);
      unit.then((exe: Array<any>) => {
        this.ExeList = exe;
        resolve(true);
      }).catch(e => {
        resolve(false);
      });
    });
  }

  //nesscary function

  start(board) {
    console.log("game start");
    this.board = board;
    this.onGameStart();
    this.playExe();
  }

  continue(board) {
    this.board = board;
    this.board.position(this.game.fen());
    this.resume();
  }

  pause() {
    this.timer.unitTimer.pause();
    this.timer.exeTimer.pause();
    this.Paused = true;
  }

  resume() {
    this.timer.unitTimer.start();
    this.timer.exeTimer.start();
    this.onGameStart();
  }

  restart() {
    this.gameboard.start()
  }

  // nessary end 
  onGameStart() {
    this.isRunning = true;
    this.Paused = false;

    this.Counter = timer(0, 1000);

    this.CounterFn = () => {
      this.timer.unitTimer.getHumanString();
      this.timer.exeTimer.getHumanString();
    }

    this.Counter.subscribe(() => {
      if (this.CounterFn != null) this.CounterFn();
    });
  }

  setGameFinish(name) {

    this.Counter = null;
    this.CounterFn = null;
    this.timer.unitTimer.pause();
    this.timer.exeTimer.pause();
    this.isRunning = false;

    alert(name + " Won");
  }

  playExe() {

    console.log("playExe", this.$CMU);

    this.ExeHistoryList = this.trainData.getLocalUnit(this.$CMU);
    if (this.ExeHistoryList != null) {
      console.log("get Local EXE History", this.ExeHistoryList);
      this.gameState.index = this.ExeHistoryList.length;
      // console.log(this.gameState.index, this.ExeList.length - 1);
      if (this.gameState.index > (this.ExeList.length - 1)) {
        this.gameState.index = 0;
      }

      // this.gameState.index = 59;
      // console.log(this.gameState.index);
      // if(typeof this.ExeHistoryList[this.gameState.index -1] != 'undefined') {
      //   this.gameState.unitTimer = this.ExeHistoryList[this.gameState.index -1].unitTimer;
      // } else {
      //   this.gameState.unitTimer = 0;
      // }

      // if(typeof this.ExeHistoryList[this.gameState.index] != 'undefined'){
      //   this.gameState.timeperexper = this.ExeHistoryList[this.gameState.index].timeperexper;
      // } else {
      //   this.gameState.timeperexper = "--:--";
      // }

      // this.timer.exeTimer.init(this.tpxLimit);
      // this.timer.unitTimer.setBaseTime(this.gameState.unitTimer);

    } else {
      this.ExeHistoryList = [];
      this.gameState = {
        index: 0,
        timeperexper: "--:--",
        unitTimer: 0,
        exeTimer: 0
      };
    }

    console.log("gameindex", this.gameState.index);
    console.log("ExeList Length", this.ExeList.length);
    console.log("ExeList", this.ExeList);

    // this.loadNextAndPlay();
    this.goToNextExe();
  }

  loadNextAndPlay() {
    let curexe = this.ExeList[this.gameState.index];
    console.log("current exe", curexe);
    this.pgn.init(curexe, this);

    console.log('load current PGN', this.pgn);

    this.board.position(this.pgn.getFen());
    this.game.load(this.pgn.getFen());

    console.log(this.pgn.getFen(), this.game.fen(), this.game.turn())
    this.timer.unitTimer.start();
    this.timer.exeTimer.start();

    if (this.pgn.isWhiteOnMove()) {
      this.pgn.currentOpponent = 'b';
      if (this.userService.gameSetting.whiteAlwaysSouth === false) this.board.orientation('white');
    } else {
      this.pgn.currentOpponent = 'w';
      // console.log(this.userService.gameSetting.whiteAlwaysSouth);
      if (this.userService.gameSetting.whiteAlwaysSouth === false) this.board.orientation('black');
    }

    if (this.pgn.isWhiteOnMove()) {
      this.instruction = "What is White`s best move";
    } else {
      this.instruction = "What is Black`s best move";
    }

    this.pgn.nextStepIfRequired();
  }

  goToNextExe() {
    let limitOfExe = this.ExeList.length;

    if (typeof this.ExeHistoryList[this.gameState.index - 1] != 'undefined' && this.ExeHistoryList[this.gameState.index - 1] != null) {
      this.gameState.unitTimer = this.ExeHistoryList[this.gameState.index - 1].unitTimer;
    } else {
      this.gameState.unitTimer = 0;
    }

    if (typeof this.ExeHistoryList[this.gameState.index] != 'undefined' && this.ExeHistoryList[this.gameState.index] != null) {

      const secondsToHuman = (sec) => {
        var minutes = Math.floor(sec / 60);
        sec %= 60;
        return '' + minutes + ':' + (sec < 10 ? '0' : '') + sec;
      }

      let currentExeUnitTimer = this.ExeHistoryList[this.gameState.index].unitTimer;
      let preExeUnitTimer = (typeof this.ExeHistoryList[this.gameState.index - 1] != 'undefined' && this.ExeHistoryList[this.gameState.index - 1] != null) ? this.ExeHistoryList[this.gameState.index - 1].unitTimer : 0;

      console.log(currentExeUnitTimer, preExeUnitTimer);
      this.gameState.timeperexper = secondsToHuman(currentExeUnitTimer - preExeUnitTimer);
    } else {
      this.gameState.timeperexper = "--:--";
    }

    this.timer.exeTimer.reset();
    this.timer.unitTimer.reset();
    this.timer.exeTimer.init(this.tpxLimit);
    this.timer.unitTimer.setBaseTime(this.gameState.unitTimer);

    if (this.gameState.index > limitOfExe) {
      this.unitFinished();
    } else {
      this.loadNextAndPlay();
    }

  }

  unitFinished() {
    this.view.showUnitFinished("Unit Finished !!");
  }

  goNext() {
    console.log("t", this.gameState.index, this.ExeList)
    if (this.gameState.index >= this.ExeList.length - 1) {
      this.unitFinished();
      this.gameState.index = 0;
      // this.goToNextExe();
      return;
    }

    console.log(this.ExeHistoryList[this.gameState.index]);
    if(typeof this.ExeHistoryList[this.gameState.index] == 'undefined') return;

    this.gameState.index++;

    this.goToNextExe();
  }

  goPre() {
    if (this.gameState.index == 0) {
      return false;
    }

    this.gameState.index--;
    this.goToNextExe();
  }

  endExe() {
    // last step in exercise, is autoload next exercise enabled?
    if (this.userService.gameSetting.autoloadNextExercise) {
      this.game.reset();
      // if(this.pgn.handleCurrentComment( this, 'goNext') === false) this.goNext();
      this.goNext();
    }
  }

  updateStatus() {
    console.log('updateStatus');
    this.endExe();
  }

  onExerciseFinished() {
    this.timer.unitTimer.pause();
    this.timer.exeTimer.pause();

    let tpx = this.timer.exeTimer.getSeconds();

    this.ExeHistoryList[this.gameState.index] = {
      timeperexperSec: tpx,
      unitTimer: this.timer.unitTimer.getSeconds(),
      solved_date: Math.floor(new Date().getTime() / 1000)
    };

    this.trainData.saveLocalUnit(this.$CMU, this.ExeHistoryList);
    let data = {
      theme_number: this.$CMU.category,
      module_number: this.$CMU.module,
      unit_number: this.$CMU.unit,
      exercise_number: this.gameState.index,
      study_time: this.timer.unitTimer.getSeconds()
    };

    this.connect.saveExe(data);
  }

  onRightMove() {
    console.log("train onRightMode Called");
    this.timer.exeTimer.pause();
    this.timer.unitTimer.pause();
    this.instruction = 'Well done!';
    this.character = 'good';
  }

  animateTick() {
      this.soundService.makesound(this.soundService.SoundType.END);
      return this.gameboard.animateTick();
  }
  

  showcomment(comment, resolve) {
    this.commentResolve = resolve;
    this.isshowcomment = true;
    $('#commentsview').show();
    this.view.comment = comment;
  }

  hidecomment() {
    this.isshowcomment = false;
    $('#commentsview').hide();
  }

  commentOk() {
    this.commentResolve(true);
  }

  gamerules(removeGreySquares, greySquare) {

    var e = this;
    var game = this.game;

    const onDragStart = function (source, piece, position, orientation) {

      if (!e.isRunning) return false;
      if (game.turn() == 'w') {
        if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1) {
          return false;
        }
      } else {
        if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^w/) !== -1) {
          return false;
        }
      }

      return true;
    };

    const onDrop = function (board, source, target) {

      let piece = e.game.get(source);
      console.log('Trying to move ' + (piece !== null ? piece.type : 'nothing') + ' from ' + source + " to " + target);

      if (source === target || target === 'offboard') {
        return 'snapback';
      }

      let correctMove = e.pgn.isCorrectMoveStep(source, target);
      let isLastStep = e.pgn.isLastStepInPGN();
      let isLastMove = e.pgn.isLastMoveInPGN();

      console.log('user move is correct: ' + (correctMove ? 'yes' : 'no') + ' - is lastmove in pgn: ' + isLastMove + ' - is laststep in pgn: ' + isLastStep);
      if (correctMove) {
        // see if the move is legal
        var move = e.game.move({
          from: source,
          to: target,
          promotion: e.pgn.getCurrentMoveStepPromotion()
        });

        if (move === null) {
          console.log('Illegal move?! But it\'s correct!');
          // illegal move
          return 'snapback';
        } else {
            // console.log("is last step", isLastStep);
            if (isLastMove && isLastStep) {;
              e.onExerciseFinished();
              e.onRightMove();
              e.animateTick().then(() => {
                e.pgn.handleCurrentComment().then(res => {
                  if(res === false) {
                      e.endExe();   
                  }
                  else if(res === true) {
                    e.hidecomment();
                    e.endExe();
                  }
                });
              });
            } else {
              e.onRightMove();
              e.pgn.nextStep();
            } 
        }
      } else {
        e.pgn.onWrongMove();
        return 'snapback';
      }
    };

    const onMouseoutSquare = function (square, piece) {
      removeGreySquares();
    };

    const onMouseoverSquare = function (square, piece) {
      var moves = game.moves({
        square: square,
        verbose: true
      });

      if (moves.length === 0) return;

      greySquare(square);

      for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
      }
    };

    const onSnapEnd = function (board) {
      board.position(game.fen());
    };

    this.cfg = {
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare,
      onSnapEnd: onSnapEnd
    };
  }
}

