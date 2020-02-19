import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TraingamePage } from './traingame.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { GameboardModule } from 'src/app/gameboard/gameboard.module';

const routes: Routes = [
  {
    path: '',
    component: TraingamePage
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
  declarations: [TraingamePage]
})
export class TraingamePageModule {}
