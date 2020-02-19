import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrainunitsPage } from './trainunits.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TrainunitsPage
  },
  { path: 'traingame', loadChildren: () => import('./traingame/traingame.module').then( m => m.TraingamePageModule)},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TrainunitsPage]
})
export class TrainunitsPageModule {}
