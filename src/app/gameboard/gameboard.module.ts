import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameboardComponent } from './gameboard.component';



@NgModule({
  declarations: [GameboardComponent],
  imports: [
    CommonModule
  ],
  exports: [
    GameboardComponent
  ]
})
export class GameboardModule { }
