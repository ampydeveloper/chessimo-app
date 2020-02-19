import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrainoverviewPage } from './trainoverview.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TrainoverviewPage
  },
  { path: 'trainunits', loadChildren: () => import('./trainunits/trainunits.module').then( m => m.TrainunitsPageModule) },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TrainoverviewPage]
})
export class TrainoverviewPageModule {}
