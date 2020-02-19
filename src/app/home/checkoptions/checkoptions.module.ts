import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CheckoptionsPage } from './checkoptions.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CheckoptionsPage
  },
  { path: 'checkgame', loadChildren: () => import('./checkgame/checkgame.module').then(m =>m.CheckgamePageModule) },
  { path: 'elo-history', loadChildren: () => import('./elo-history/elo-history.module').then( m => m.EloHistoryPageModule) },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckoptionsPage]
})
export class CheckoptionsPageModule {}
