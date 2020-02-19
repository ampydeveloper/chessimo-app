import { PlaygamePage } from './home/playoptions/playgame/playgame.page';
import { Injectable } from '@angular/core';
import { Timer, ReverseTimer} from './gameboard/classes/timer';
import { timer }  from 'rxjs';

declare var Chess;
@Injectable({
  providedIn: 'root'
})
export class PlayService {
  
  // Nessacary to define
  cfg: any = {};
  Paused   = false;
  waitForSelection = false;

  initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";  
  gameboard:any = {};
  view: PlaygamePage;

  own: any;
  ai: any;
  game: any = null;
  turn: any = 'own';
  board: any;

  timer: any = {
    own: new ReverseTimer,
    ai: new ReverseTimer
  }

  Counter: any = null;
  CounterFn: any = null;
  isRunning = false;
  isFinished = false;

  storedSource: any;
  storedTarget: any;
  MOUSE_DOWN_PIECE: any;

  constructor() {

    // default parameters
    this.own = {
      time: 5,
      extra_time: 1,
      color: "white",
      name: 'Player 1'
    };

    this.ai = {
      time: 5,
      extra_time: 1,
      color: "black", 
      name: 'Player 2'
    };

    this.turn = 'own';
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
    this.timer.own.reset();
    this.timer.ai.reset();

    this.timer.own.init(this.own.time * 60);
    this.timer.ai.init(this.ai.time * 60);

    this.turn = 'own';
    this.game = new Chess();
  }

  //nesscary function

  start(board) {
    this.board = board;
    this.onGameStart();
    this.timer.own.start();
    this.isFinished = false;
    this.waitForSelection = false;
  }

  continue(board){
    this.board = board;
    this.board.position(this.game.fen());
    this.resume();
  }

  pause() {
    this.timer.own.pause();
    this.timer.ai.pause();
    this.Paused = true;
  }

  resume() {
    if(this.turn == 'own') {
      this.timer.ai.pause();
      this.timer.own.start();
    } else {
      this.timer.own.pause();
      this.timer.ai.start();
    }

    this.onGameStart();
  }

  restart() {
    this.gameboard.start();
  }

  // nessary end 
  onGameStart(){
    this.isRunning = true;
    this.Paused = false;
    
    this.Counter = timer(0, 1000);

    this.CounterFn = () => {
      this.timer.own.getHumanString();
      this.timer.ai.getHumanString();

      if(this.timer.own.getSecondsLeft() <= 0) {
          this.setGameFinish(this.ai.name);
      }

      if(this.timer.ai.getSecondsLeft() <= 0) {
          this.setGameFinish(this.own.name);
      }
    }

    this.Counter.subscribe( () => {
      if(this.CounterFn != null) this.CounterFn();
    });
  }

  setGameFinish(name) {

    this.Counter = null;
    this.CounterFn = null;
    this.timer.own.pause();
    this.timer.ai.pause();
    this.isRunning = false;
    this.isFinished = true;

    console.log(name);
    let msg = ''; 
    if(this.game.in_draw() === true)
    {
      msg = 'Draw';
    }
    else {
      msg = '!! ' + name + ' won !!';
    }

    this.isFinished = true;
    this.view.gameFinished(msg);
  }

  switchTurn() {
    
      if (this.game.in_checkmate() === true || this.game.in_draw()) {
        this.setGameFinish(this[this.turn].name);
        return;
      }
      
      if(this.turn == 'own') {
        this.turn = 'ai';
        this.timer.own.pause();
        this.timer.ai.start();
      } else {
        this.turn = 'own';
        this.timer.ai.pause();
        this.timer.own.start();
      }
  }

  makeChoice(source, target, MOUSE_DOWN_PIECE) {
      this.storedSource = source;
      this.storedTarget = target;
      this.MOUSE_DOWN_PIECE = MOUSE_DOWN_PIECE;

      this.waitForSelection = true;
  }

  onPromotionClick(sender) {
      var promotion = "";
      if (sender == 'Rook') {
          promotion = "r";
      }
      else if (sender == "Queen") {
          promotion = "q";
      }
      else if (sender == "Knight") {
          promotion = "n";
      }
      else if (sender == "Bishop") {
          promotion = "b";
      }
      else {
          promotion = "q";
      }

      this.preProcess(promotion);
      this.waitForSelection = false;
  }

  preProcess(promotionChoice) {
    this.proc(promotionChoice, this.storedSource, this.storedTarget);
    // this.board.putPromotion(promotionChoice, this.storedSource, this.storedTarget, this.MOUSE_DOWN_PIECE);
  }

  proc(x, source, target) {

    var move = this.game.move({
        from: source,
        to: target,
        promotion: x //'q' // NOTE: always promote to a queen for example simplicity
    });
    console.log("proc",move);
    // illegal move
    if (move === null) {
        return 'snapback';
    }

    this.board.position(this.game.fen());
    this.switchTurn();
  }
  
  gamerules(removeGreySquares, greySquare) {

    var e = this;
    var game = this.game;

    const onDragStart = function(source, piece, position, orientation) {

      if(!e.isRunning) return false;

      if(e[e.turn].color == 'white') {
        if (
          game.in_checkmate() === true ||
          game.in_draw() === true ||
          piece.search(/^b/) !== -1
        ) {
          return false;
        }
      } else {
        if (
          game.in_checkmate() === true ||
          game.in_draw() === true ||
          piece.search(/^w/) !== -1
        ) {
          return false;
        }
      }

      return true;
     
    };

    const onDrop = function(board, source, target, MOUSE_DOWN_PIECE) {

      if(game.isValidMode({
                            from: source,
                            to: target,
                            promotion: "q"
                          })) {
        if (game.is_pawn_transform(source, target)) {
          e.makeChoice(source, target, MOUSE_DOWN_PIECE);
            return;
        }
      } else {
        return "snapback";
      } 

      var move = game.move({
        from: source,
        to: target,
        promotion: "q"
      });

      removeGreySquares();
      if (move === null) {
        return "snapback";
      }
      // renderMoveHistory(this.game.history());
      e.switchTurn();
    };

    const onMouseoutSquare = function(square, piece) {
      removeGreySquares();
    };

    const onMouseoverSquare = function(square, piece) {
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

    const onSnapEnd = function(board) {
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
