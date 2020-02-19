import { SoundService } from './../sound.service';
import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from '../user.service';

declare var $, ChessBoard;
@Component({
    selector: 'app-gameboard',
    templateUrl: './gameboard.component.html',
    styleUrls: ['./gameboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GameboardComponent implements OnInit {

    @Input('game')
    game: any;

    @Input('command')
    command: any;

    @Input('extraSize')
    extraSize: any;

    boardDOM: any;
    board: any = {};
    screenSize = 0;

    constructor(public el: ElementRef, public platform: Platform, public userService: UserService, public soundService: SoundService) {
        
    }

    ngOnInit() {
        this.platform.ready().then((readySource) => {
            this.initParamenters();
            this.setBoardSize();
            this.game.gameboard = this;
            console.log("gameboard init");
            if(this.command == 'start') {
                this.start();
            } else {
                this.continue();
            }
            
        });
    }

    initParamenters() {
        let width = $('body').width();
        let height = $('body').height() - this.extraSize;
        console.log('box szie', width, height);
        let size = 0;
        if (width < height) {
            size = width - 8;
            size = width - 8;
        }
        else {
            size = height - 8;
            size = height - 8;
        }

        let r = size % 8;
        size = size -r;
        this.screenSize = size;
        console.log("screenSize", this.screenSize);

    }

    setBoardSize() {
        this.boardDOM = this.el.nativeElement.querySelector('#board');
        this.boardDOM.style.width = this.screenSize + 'px';
        this.boardDOM.style.height = this.screenSize + 'px';

        let boardOuterDOM = this.el.nativeElement.querySelector('.board-outer');
        boardOuterDOM.style.width = this.screenSize + 'px';
        boardOuterDOM.style.height = this.screenSize + 'px';
    }

    greySquare(square) {
        var squareEl = $("#board .square-" + square);

        var background = "#a9a9a9";
        if (squareEl.hasClass("black-3c85d") === true) {
            background = "#696969";
        }

        squareEl.css("background", background);
    };

    removeGreySquares() {
        $('#board .square-55d63').css('background', '');
    };

    start() {
        console.log("gameboard start");
        this.game.init();//debugger;
        // console.log(this.userService.gameSetting.pieceSet);
        this.game.gamerules(this.removeGreySquares, this.greySquare);
        // this.game.cfg.pieceTheme = (piece) => 'assets/chess/chessboardjs/chesspieces/' + this.userService.gameSetting.pieceSet + '/'+piece+'.png';

        // this.game.cfg.screenSize = this.screenSize;
        let makesound = this.soundService;
        this.board = ChessBoard(this.boardDOM, this.game.cfg, makesound, this.userService);
        this.game.start(this.board);
    }

    continue () {

        if(this.game.isRunning == true) {
            
            this.game.gamerules(this.removeGreySquares, this.greySquare);
            this.game.cfg.pieceTheme = 'assets/chess/chessboardjs/chesspieces/' + this.userService.gameSetting.pieceSet + '/{piece}.png';

            let makesound = this.soundService;
            this.board = ChessBoard(this.boardDOM, this.game.cfg, makesound, this.userService);
            this.game.continue(this.board);
        }
        else {
            this.start();            
        }
    }

    animateTick() {
        return new Promise((resolve, reject) => {
            $('.blue-check').show();
            setTimeout(()=> {
                $('.blue-check').hide();
                resolve(true);
            }, 500);
        });
    }

}
