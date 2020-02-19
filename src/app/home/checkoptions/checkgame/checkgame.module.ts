import { GameboardModule } from './../../../gameboard/gameboard.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CheckgamePage } from './checkgame.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CheckgamePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    GameboardModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckgamePage]
})
export class CheckgamePageModule {}
