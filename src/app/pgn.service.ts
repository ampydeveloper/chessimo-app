import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { TrainService } from './train.service';
import { UtilityService } from './utility.service';

declare var $;
@Injectable({
  providedIn: 'root'
})
export class PgnService {

  game: TrainService;
  boardId: any = 'board';

  steps: any;
  stepIndex: any = 0;
  moveIndex: any = 0;

  tippCounter: any = 0;
  wrongCounter: any = 0;
  currentOpponent = 'b';

  bugCounter: any = 0;
  isCommentHandlingOn: boolean = true;

  tmpCommentHandlingOn: boolean = true;
  autoMoveOpponentEnabled: boolean = true;
  autoSolveExerciseEnabled: boolean = false;

  exe: {
    black,
    date,
    event,
    fen,
    game_terminator,
    moves,
    title,
    white,
    white_sort
  };

  constructor(public utility: UtilityService, public userService: UserService) { }

  init(exe, game) {
    this.moveIndex = 0;
    this.stepIndex = 0;
    this.exe = exe;
    this.game = game;
    this.tippCounter = 0;
    this.clearHighlights();
    this.wrongCounter = 0

    this.game.character = '';

    let currentMove = this.getMove(this.moveIndex);
    this.steps = this.getMoveSteps(currentMove.move);

    if (currentMove.moveAlt && this.steps.length > 0) {
      for (var j = 0; j < this.steps.length; j++) {
        this.steps[j].alt = [];
        for (var n = 0; n < currentMove.moveAlt.length; n++) {
          var altMoves = this.getMoveSteps(currentMove.moveAlt[n])
          this.steps[j].alt.push(altMoves[j]);
        }
      }
    }
  }

  // used init
    getMoveCount() {
      return this.exe.moves.length;
    }

    getMove(index) {
      if (index == undefined) {
        index = this.moveIndex;
      }
      if (index >= this.getMoveCount()) {
        return null;
      }
      var ret = this.exe.moves[index];
      return ret;
    }

    isWhiteOnMove() {
      console.log('is white',this.game.game.turn());
      return this.game.game.turn() === 'w';
    }

    doTipp() {
      console.log('doTipp');
      this.tippCounter++;
      console.log('Trainer: doTipp ' + this.tippCounter);
      var correctMove = this.getCorrectMove();
      if (correctMove != null) {
          var fromField = correctMove.from;
          this.setHighlight(fromField, false);
          if (this.tippCounter >= 2) {
              var toField = correctMove.to;
              console.log("set to field");
              this.setHighlight(toField, true);
          }
  
          if (correctMove.alt && correctMove.alt.length > 0) {

              for (var n = 0; n < correctMove.alt.length; n++) {
                  fromField = correctMove.alt[n][0].from;
                  this.setHighlight(fromField, false);
                  if (this.tippCounter >= 2) {
                      toField = correctMove.alt[n][0].to;
                      this.setHighlight(toField, true);
                  }
              }
          }
      } else {
          var step = this.getCurrentMoveStep();
      }
    }

    setHighlight(field, isToField) {
        //window.logToFile.debug('setHighlight');
        if (field != undefined && field.length == 2) {
            var elID = '#' + this.boardId + ' .square-' + field;
            var elements = $(elID);
            if (elements.length > 0) {
                if (isToField === true) {
                    elements.addClass('highlight2');
                } else {
                    // from field
                    elements.addClass('highlight1-32417');
                }
                // console.log('Highlighted elements: '+elID);
            } else {
                console.log('ERROR: could not set highlight to elements ' + elID);
            }
        }
    }

    clearHighlights() {
        console.log('clearHighlights');
        var el = $('#' + this.boardId + ' .square-55d63'); // select all square elements
        el.removeClass('highlight1-32417');
        el.removeClass('highlight2');
        console.log('highlights cleared');
    }

    // getMoveSteps
    getMoveSteps(str) {
      var ret = [];
      console.log('parsing move steps from \'' + str + '\'');
      //window.logToFile.debug('parsing move steps from \''+str+'\'');
      var startedBlock = false;
      var blockStartIdx = -1;
      var beganWithNumber = false;
      var inParantheses = false;
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (c == '(') { // e.g. '1. Ke6 (1. Kc6 $11) 1... Ke8 2. d6 Kd8'
          inParantheses = true;
          continue;
        } else if (c == ')') {
          inParantheses = false;
          blockStartIdx = i + 1;
          continue;
        }
        if (inParantheses) {
          continue;
        }
        if (c == ' ' || i == str.length - 1) {
          if (startedBlock) {
            // ending block
            var endIdx = i;
            if (c != ' ' && i == str.length - 1) { endIdx = i + 1; }
            var block = str.substring(blockStartIdx, endIdx);

            // console.log('ending block: \'' + block + '\' (beganWithNumber: ' + (beganWithNumber ? 'yes' : 'no') + ')');

            startedBlock = false;
            if (beganWithNumber == false) {
              // Found move step
              var blockCleaned = block;
              var fromCol = null; // e.g. a,b,c,...,g OR 1,2,3,4,5 etc.!
              var promotion = null;
              blockCleaned = blockCleaned.replace('#', '');
              blockCleaned = blockCleaned.replace('x', '');
              blockCleaned = blockCleaned.replace('+', '');
              if (blockCleaned.indexOf('=') != -1) {
                var rest = blockCleaned.substring(blockCleaned.indexOf('=') + 1);
                if (rest.length > 0) {
                  promotion = rest.charAt(0).toLowerCase();
                }
                blockCleaned = blockCleaned.substring(0, blockCleaned.indexOf('='));
              }
              if (blockCleaned == 'O-O-O' || blockCleaned == 'O-O') {

              } else if (blockCleaned.length > 2) {
                for (var o = 0; o < blockCleaned.length - 2; o++) {
                  var oc = blockCleaned.charAt(o);

                  console.log('checking char \'' + oc + '\' in block > len 2');

                  if (oc.toLowerCase() === oc) {
                    // oc is lower case
                    fromCol = oc;
                    break;
                  }
                }
                if (fromCol != null) {
                  blockCleaned = blockCleaned.replace(fromCol, '');
                }
              }
              ret.push({ 'block': block, 'cleaned': blockCleaned, 'fromCol': fromCol, 'promotion': promotion });
            }
          }
          continue;
        }
        if (startedBlock == false) {

          // console.log('started block at idx ' + i + ' with char: \'' + c + '\'');

          startedBlock = true;
          if ($.isNumeric(c)) {
            blockStartIdx = i;
            beganWithNumber = true;
          } else {
            blockStartIdx = i;
            beganWithNumber = false;
          }
        }
      }
      return ret;
    }


  ////

      // Need in train
      getFen() {
        return this.exe.fen;
      }

  // Train game On Drop

      // isCorrectMoveStep
          getPossibleMovesTo(dest) {
            //window.logToFile.debug('getPossibleMovesTo');
            var destTo = dest;
            var pieceFilter = null;
            if (dest.length == 3) {
                destTo = dest.substring(1);
                pieceFilter = dest.substring(0, 1).toLowerCase();
            }
            var moves = this.game.game.moves({ 'verbose': true });
            var ret = [];
            for (var i = 0; i < moves.length; i++) {
                var move = moves[i];
                if (dest == 'O-O' || dest == 'O-O-O') {
                    if (move.san == dest || move.san == dest + '+') {
                        ret.push(move);
                    }
                } else if (move.to == destTo) {
                    if (pieceFilter == null || move.piece == pieceFilter) {
                        ret.push(move);
                    }
                }
            }
            if (ret.length > 1) {
                var reordered = [];
                // Order moves and push all pawn moves to the beginning
                for (var i = 0; i < ret.length; i++) {
                    var move = ret[i];
                    if (move.piece == 'p') {
                        reordered.push(ret[i]);
                    }
                }
                for (var i = 0; i < ret.length; i++) {
                    var move = ret[i];
                    if (move.piece != 'p') {
                        reordered.push(ret[i]);
                    }
                }
                ret = reordered;
            }
            return ret;
          }

          getCurrentMoveStep() {
            var ret = this.steps[this.stepIndex];
            console.log("steps", this.steps);
            console.log(this.stepIndex);
            if (ret == undefined) { console.log('WARNING: move step index ' + this.stepIndex + ' is not set!'); }
            return ret;
          }

          getCorrectMove() {

            function isCorrentAltChar(alt, from) {
              if (!alt || alt.length == 0) return false;
              for (var n = 0; n < alt.length; n++) {
                if (alt[n][0].from.charAt(0) == from || alt[n][0].from.charAt(1) == from) return true;
              }
              return false;
            }

            var move = null;


            var step = this.getCurrentMoveStep();
            console.log("step", step);
            if (step == undefined) {
              console.log('getCorrectMove: current move step not exists!');
              return move;
            }
            var opponentsMove = step.cleaned;
            if (opponentsMove == 'O-O') { // king-side-castling
              console.log('Kingside castling!');
            } else if (opponentsMove == 'O-O-O') {
              console.log('Queenside castling!');
            }
            var moves = this.getPossibleMovesTo(opponentsMove);

            if (step.alt && step.alt.length > 0) {
              moves[0].alt = [];
              for (var n = 0; n < step.alt.length; n++) {
                if (step.alt[n]) {
                  opponentsMove = step.alt[n].cleaned;
                  moves[0].alt.push(this.getPossibleMovesTo(opponentsMove));
                }
              }
            }
            

            if (moves.length >= 1) {
              console.log('getCorrectMove: ' + moves.length + ' possible move(s) found for \'' + step.block + '\'!');
              if (moves.length > 1) {
                console.log(moves);
              }
              move = moves[0]; // take the first
              // find a better move (e.g. if fromCol = g or 1)
              if (step.fromCol !== null) {
                for (var i = 0; i < moves.length; i++) {
                  var tmp = moves[i];
                  if (tmp.from.charAt(0) == step.fromCol || tmp.from.charAt(1) == step.fromCol
                    || isCorrentAltChar(tmp.alt, step.fromCol)
                  ) {
                    console.log('Found better matching move for fromCol=' + step.fromCol + ' with from=' + move.from);
                    move = tmp;
                    break;
                  }
                }
              }
            }
            return move;
          }

          isCorrectMoveStep(source, target) {
            function isCorrectAltMove(alt) {
              if (!alt || alt.length == 0) return false;
              for (var n = 0; n < alt.length; n++) {
                if (alt[n][0].from == source && alt[n][0].to == target) {
                  return true;
                }
              }
              return false;
            }

            // var piece = this.game.game.get(source);
            var ret = false;

            var correctMove = this.getCorrectMove();
            if (correctMove != null) {
              if (
                (correctMove.from == source && correctMove.to == target)
                || isCorrectAltMove(correctMove.alt)
              ) {
                ret = true;
              }
            }
            return ret;
          }
      //////////////////////

      isLastStepInPGN() {
        //window.logToFile.debug('isLastStepInPGN');
        var ret = false;
        if (this.stepIndex + 1 >= this.steps.length) {
          ret = true;
        }
        return ret;
      }

      isLastMoveInPGN() {
        console.log('move count', this.getMoveCount());
        console.log('move Index', this.moveIndex);
        if(this.moveIndex + 1 >= this.getMoveCount())
        {
          return true;
        }
      }

      getCurrentMoveStepPromotion() {
        var step = this.getCurrentMoveStep();
        if (step != undefined) {
          console.log('Current promotion: ' + step.promotion);
          return (step.promotion == null ? 'q' : step.promotion);
        }
        return 'q';
      }

      onWrongMove() {
        if (this.wrongCounter == 0) {
          this.game.instruction = 'This move was not right';
          this.game.character = 'tryagain';
        } else {
          this.game.instruction = 'This move was not right again';
          this.game.character = 'bad';
        }
        this.wrongCounter++;
        console.log('This move wasn\'t right (' + this.wrongCounter + ')');
        
        let tries = this.game.userService.trainingSetting.trainSolutionTries;
        if( tries > 0)
        {
          // show solution after x tries
          console.log('(' + this.wrongCounter + ' / ' + tries + ' to show solution)');
          if (this.wrongCounter >= tries) {
            var self = this;
            window.setTimeout(function () {
              self.doTipp();
            }, 10);
          }
        }
      }


      ////////////////////////////////////////////////////////////////
      /////    For Multi Step PGN                         ////////////
      ////////////////////////////////////////////////////////////////
      // onRightMove() {
      //   console.log("onRightMode Called");
      //   this.game.timer.exeTimer.pause();
      //   this.game.timer.unitTimer.pause();
      //   this.game.instruction = 'Well done!';
      //   this.game.character = 'good';
      //   // makeSound(SoundType.END);
      //   this.afterRightMove();
      //   // this.nextStep();

      // }

      // afterRightMove() {
      //   console.log('_afterRightMove');
      //   let isLastStep = this.isLastStepInPGN();
      //   if (isLastStep) {
      //       console.log('afterLastStepRight')
      //       this.afterLastStepRight(); // calls _checkGotoNextStep later
      //   } else {
      //       this.checkGotoNextStep();
      //       console.log('checkGotoNext');
      //   }
      // }

      // afterLastStepRight() {
      //   this.game.gameboard.animateTick();
      //   setTimeout(()=> {
      //     console.log('moduleTrainer after success animation finished');
      //     this.checkGotoNextStep();
      //   }, 700);
      //   // setTimeout(() => {
      //   //         this.game.endExe();
      //   //     }, 200);
      // }

      //checkGotoNextStep() {
        //window.logToFile.debug('_checkGotoNextStep');
        // console.log('_checkGotoNextStep');
        // let gotoNextStep = false;
        // let isLastStep = this.isLastStepInPGN();
        // if (!isLastStep) {
        //     gotoNextStep = true;
        // } else {
        //     // last step in exercise, is autoload next exercise enabled?
        //     if (this.userService.gameSetting.autoloadNextExercise) {
        //         gotoNextStep = true;
        //     }
        // }

        // console.log('gotoNextStep', gotoNextStep);
        // if (gotoNextStep) {
            // if (this.nextStep()) {
            //     // okay
            //     this.game.updateStatus();
            // } else {
            //     // END of training reached!
            //     console.log('end of training reached!');
            // }
        // } else {
        //     console.log('autoload next exercise is disabled');
        //     this.updateStepInfo();
        // }
      //}

      // updateStepInfo() {
      //     console.log('updateStepInfo');
      //     // var currentExerciseHasBeenSolvedInHistory = this.currentExerciseHasBeenAlreadySolvedInHistory();
      //     // let options:any = {};
      //     // if (currentExerciseHasBeenSolvedInHistory == false) {
      //     //     options.forceNextStepDisabled = true;
      //     // }
      //     //this.gameInfoBox.setStepInfo(this.game.gameState.index, this.getPGNCount(), options);
      // }  
      
  
      // currentExerciseHasBeenAlreadySolvedInHistory() {
      //     //window.logToFile.debug('currentExerciseHasBeenAlreadySolvedInHistory');
      //     var info = this.getCurrentExerciseTrainInfo();
      //     return (info !== null);
      // }

      // getCurrentExerciseTrainInfo() {
      //   console.log('getCurrentExerciseTrainInfo');
      //     // var cat = this.getCurrentCategory();
      //     // var mod = this.getCurrentModule();
      //     // var unit = this.getCurrentUnit();
      //     // var exercise = this.getCurrentExercise();
      //     // var trainInfo = this.game.trainData.getExerciseTrainInfo(cat, mod, unit, exercise);
      //     // return trainInfo;
      // }

     
      getCurrentMoveStepBlock() {
        //window.logToFile.debug('getCurrentMoveStepBlock');
        var ret = this.steps[this.stepIndex];
        if (ret != undefined) {
            return ret.block;
        }
        return "---";
      }

      doAutoMove() { // executes just the current move step
        //window.logToFile.debug('doAutoMove');
          var ret = false;
          var move = this.getCorrectMove();
          if (move == null) {
              console.log('correct move for auto-move \'' + this.getCurrentMoveStepBlock() + '\' not exists!');
              this.game.instruction = ('Auto-move ' + this.getCurrentMoveStepBlock() + ' not possible!');
              this.bugCounter++;
              return true; // forces next step
          }
          console.log('auto-move found! ' + move.from + ' -> ' + move.to + ' (' + this.getCurrentMoveStepBlock() + ')');
          ret = true;
          var done = this.game.game.move({
              from: move.from,
              to: move.to,
              promotion: this.getCurrentMoveStepPromotion()
          });
          if (done == false) {
            this.game.instruction =('Auto-move to ' + move.to + ' is not valid!');
          } else {
              // this.view.updateChessboard();
              this.game.board.position(this.game.game.fen());
          }
          return ret;
      }


     

      gotoNextMove() {
        console.log('GameTrainer: next move');
       
        this.moveIndex++;
        if (this.moveIndex >= this.getMoveCount()) {
            this.moveIndex = 0;
            return this.game.endExe();
        }
        this.steps = this.getMoveSteps(this.getMove(this.moveIndex).move);
        this.stepIndex = 0;
        this.nextStepIfRequired();
        return true;
      }

      


      /// New Set 
      handleCurrentComment() {
          return new Promise((resolve) => {
            console.log('handleCurrentComment');
            // get the right comment
            let comments = this.getMove(this.moveIndex).comment;
            let code = 'en';
            let comment = comments[code];
            if (comment != undefined && comment != "") {
                this.game.showcomment(comment, resolve);
            } else {
              resolve(false);
            }   
          });  
      }

      checkAutoDo() {
          if (this.autoMoveOpponentEnabled == true && this.autoSolveExerciseEnabled == false && !(this.moveIndex == 0 && this.stepIndex == 0) && this.game.game.turn() == this.currentOpponent) 
          {
              var self = this;
              console.log("ready for do AutoMove");
              window.setTimeout(function () {
                  if (self.doAutoMove()) {
                    setTimeout( () => {
                      self.nextStep();
                    }, 800);
                  }
              }, 800);
          } 
      }

      async nextStep() {
        console.log('GameTrainer: next step');
        this.game.timer.exeTimer.start();
        this.game.timer.unitTimer.start();
        this.tippCounter = 0;
        this.wrongCounter = 0;
        let ret: any = true;
        this.stepIndex++;
        this.clearHighlights();

        console.log("stepIndex", this.stepIndex);
        console.log("step length", this.steps.length);

        if (this.stepIndex >= this.steps.length) {
            console.log('ishowcomment', this.game.isshowcomment);
            if(this.isCommentHandlingOn == true) {
              // this.handleCurrentComment().then( res => {
              //   console.log("resolve comments get back");
              //   this.game.hidecomment();
              // });
              await this.handleCurrentComment();
              console.log("resolve comments get back");
              this.game.hidecomment();
            
            }
           
            this.stepIndex = -1;
            this.wrongCounter = 0;
            ret = this.gotoNextMove();
            this.checkAutoDo();
        } else {
          this.checkAutoDo();
        }
        
        return ret;
      }

      // checks if the opponent player should be handled or move=""
      nextStepIfRequired() {
          console.log('nextStepIfRequired');
          console.log(this.getMove(this.moveIndex).move);
          if (this.getMove(this.moveIndex).move == "") {
            console.log('ishowcomment', this.game.isshowcomment);
            
            setTimeout( () => {
                this.handleCurrentComment().then( res => {
                  console.log("resolve comments get back");
                  if(res === false) {
                    this.nextStep()   
                  }
                  else if(res === true) {
                    this.isCommentHandlingOn = false;
                    this.game.hidecomment();
                    this.nextStep();
                    this.isCommentHandlingOn = true;
                  }
                });
            }, 800);
        }      
      }

}
