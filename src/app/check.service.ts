import { CheckgamePage } from './home/checkoptions/checkgame/checkgame.page';
import { Injectable, NgZone } from "@angular/core";
import { ReverseTimer } from './gameboard/classes/timer';
import { timer } from 'rxjs';
import { EloService } from './elo.service';

declare var Chess;
@Injectable({
  providedIn: "root"
})
export class CheckService {

  // Nessacary to define
  cfg: any = {};
  Paused = false;
  waitForSelection = false;

  initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  reverseInitFen = "RNBQKBNR/PPPPPPPP/8/8/8/8/rnbqkbnr";
  gameboard: any = {};

  aiElo = 0;
  aiLevel = 0;

  own: any;
  ai: any;
  game: any = null;
  turn: any = 'own';
  board: any;

  timer: any = {
    own: new ReverseTimer,
    ai: new ReverseTimer
  }


  storedSource: any;
  storedTarget: any;
  MOUSE_DOWN_PIECE: any;

  Counter: any;
  CounterFn: any = null;
  isRunning = false;
  isFinished = false;
  view: CheckgamePage;

  constructor(public eloService: EloService, public zone: NgZone) {

    // default parameters
    this.own = {
      time: 5,
      extra_time: 1,
      elo: 500,
      color: "white",
      name: 'You'
    };

    this.ai = {
      time: 5,
      extra_time: 1,
      elo: "Auto (850)",
      color: "black",
      name: 'Sergio'
    };

    this.aiLevel = 0;
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

    // config intailize
    this.turn = 'own';

    if (this.own.color == "black") {
      this.cfg.orientation = 'black';
      this.ai.color = 'white';
    }

    this.aiElo = this.eloService.getKIELOBasedOnELO();
    this.aiLevel = this.eloService.getKILevelBasedOnELO(this.eloService.getELO());

    this.game = new Chess();
  }

  //nesscary function

  start(board) {
    this.board = board;
    this.isFinished = false;
    this.waitForSelection = false;
    this.onGameStart();
    if (this.own.color == "black") {
      this.switchTurn();
    } else {
      this.timer.own.start();
    }
  }

  continue(board) {
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
    if (this.turn == 'own') {
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
  onGameStart() {
    this.isRunning = true;
    this.Paused = false;

    this.Counter = timer(0, 1000);

    this.CounterFn = () => {
      this.timer.own.getHumanString();
      this.timer.ai.getHumanString();

      if (this.timer.own.getSecondsLeft() <= 0) {
        this.setGameFinish(this.ai);
      }

      if (this.timer.ai.getSecondsLeft() <= 0) {
        this.setGameFinish(this.own);
      }
    }

    this.Counter.subscribe(() => {
      if (this.CounterFn != null) this.CounterFn();
    });
  }

  setGameFinish(e) {

    this.Counter = null;
    this.CounterFn = null;
    this.timer.own.pause();
    this.timer.ai.pause();
    this.isRunning = false;

    let msg = '';
    if (this.game.in_draw() === true) {
      this.eloService.setELO(0);
      msg = 'Draw';
    }
    else {
      if (e.name == 'You') {
        this.eloService.setELO(1);
      } else if (e.name == 'Sergio') {
        this.eloService.setELO(0.5);
      }
      msg = '!! ' + e.name + ' won !!';
    }

    this.isFinished = true;
    this.view.gameFinished(msg);
  }

  switchTurn() {

    if (this.game.in_checkmate() === true || this.game.in_draw()) {
      this.setGameFinish(this[this.turn]);
      return;
    }

    if (this.turn == 'own') {
      this.turn = 'ai';
      this.timer.own.pause();
      this.timer.ai.start();

      window.setTimeout(() => { this.makeBestMove() }, 250);

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
    console.log("proc", move);
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

    const onDragStart = function (source, piece, position, orientation) {
      // console.log('onDragStart', e.own.color);
      // console.log('game.in_checkmate()', game.in_checkmate());
      // console.log('game.in_draw()',  game.in_draw());
      // console.log('piece.search(/^b/)',  piece.search(/^b/));

      if (e.own.color == 'white') {
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

    };

    const onDrop = function (board, source, target, MOUSE_DOWN_PIECE) {

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
      e.switchTurn();
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

  ////////////////// game function //////////

  afterBestMoveFound(bestMove) {
    this.game.ugly_move(bestMove);
    this.board.position(this.game.fen());
    this.switchTurn();
  }

  makeBestMove() {
    this.getBestMove();
  };

  getBestMove() {

    var reverseArray = function (array) {
      return array.slice().reverse();
    };

    var pawnEvalWhite = [
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
      [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
      [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
      [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
      [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
      [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ];

    var pawnEvalBlack = reverseArray(pawnEvalWhite);

    var knightEval = [
      [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
      [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
      [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
      [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
      [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
      [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
      [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
      [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

    var bishopEvalWhite = [
      [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
      [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
      [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
      [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
      [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
      [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
      [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
      [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
    ];

    var bishopEvalBlack = reverseArray(bishopEvalWhite);

    var rookEvalWhite = [
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
      [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
      [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
      [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
      [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
      [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
      [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
    ];

    var rookEvalBlack = reverseArray(rookEvalWhite);

    var evalQueen = [
      [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
      [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
      [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
      [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
      [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
      [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
      [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
      [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
    ];

    var kingEvalWhite = [
      [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
      [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
      [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
      [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
      [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
      [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
      [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
      [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
    ];

    var kingEvalBlack = reverseArray(kingEvalWhite);

    const getPieceValue = function (piece, x, y) {
      if (piece === null) {
        return 0;
      }
      var getAbsoluteValue = function (piece, isWhite, x, y) {
        if (piece.type === "p") {
          return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
        } else if (piece.type === "r") {
          return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
        } else if (piece.type === "n") {
          return 30 + knightEval[y][x];
        } else if (piece.type === "b") {
          return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
        } else if (piece.type === "q") {
          return 90 + evalQueen[y][x];
        } else if (piece.type === "k") {
          return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
        }
        throw "Unknown piece type: " + piece.type;
      };

      var absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);
      return piece.color === "w" ? absoluteValue : -absoluteValue;
    };


    let evaluateBoard = function (board) {
      var totalEvaluation = 0;
      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
        }
      }
      return totalEvaluation;
    };

    let minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
      if (depth === 0) {
        return -evaluateBoard(game.board());
      }

      let newGameMoves = game.ugly_moves();

      if (isMaximisingPlayer) {
        let bestMove = -9999;
        for (let i = 0; i < newGameMoves.length; i++) {
          game.ugly_move(newGameMoves[i]);
          bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
          game.undo();
          alpha = Math.max(alpha, bestMove);
          if (beta <= alpha) {
            return bestMove;
          }
        }
        return bestMove;
      } else {
        let bestMove = 9999;
        for (let i = 0; i < newGameMoves.length; i++) {
          game.ugly_move(newGameMoves[i]);
          bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
          game.undo();
          beta = Math.min(beta, bestMove);
          if (beta <= alpha) {
            return bestMove;
          }
        }
        return bestMove;
      }
    };

    // Athamentic operation
    const minimaxRoot = (depth, isMaximisingPlayer) => {
      let newGameMoves = this.game.ugly_moves();
      let bestMove = -9999;
      let bestMoveFound;

      let loopLimit = newGameMoves.length;
      let i = 0;

      const evaluate = () => {
        let newGameMove = newGameMoves[i];
        this.game.ugly_move(newGameMove);

        let value = minimax(depth - 1, this.game, -10000, 10000, !isMaximisingPlayer);

        this.game.undo();
        if (value >= bestMove) {
          bestMove = value;
          bestMoveFound = newGameMove;
        }

        i++;
        if (i < loopLimit) {
          setTimeout(() => evaluate(), depth * 20)

        } else {
          this.afterBestMoveFound(bestMoveFound);
        }
      }

      evaluate();
    };


    // let depth = 4;

    // if (this.aiLevel < 3) depth = 3;
    // if (this.aiLevel < 2) depth = 2;
    // if (this.aiLevel < 1) depth = 1;

    let lvl1 = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    let lvl2 = [1, 1, 2, 2, 2, 2, 3, 3, 4, 4];
    let lvl3 = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4];
    let lvl4 = [2, 2, 3, 3, 3, 4, 4, 4, 4, 4];

    let level = lvl4;

    if (this.aiLevel < 3) level = lvl3;
    if (this.aiLevel < 2) level = lvl2;
    if (this.aiLevel < 1) level = lvl1;

    const depth = level[Math.floor(Math.random() * level.length)];

    // console.log('aiLevel', this.aiLevel);
    console.log('depth', depth);

    minimaxRoot(depth, true);
  };

}
