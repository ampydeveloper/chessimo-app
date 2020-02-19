import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // IonicModule,
    IonicModule.forRoot({
      rippleEffect: false,
      mode: 'md'
    }),
    RouterModule.forChild([
      { path: '', component: HomePage },  
      { path: 'trainoverview', loadChildren: () => import('./trainoverview/trainoverview.module').then( m => m.TrainoverviewPageModule)},
      { path: 'checkoptions', loadChildren: ()=> import('./checkoptions/checkoptions.module').then( m => m.CheckoptionsPageModule) }, 
      { path: 'playoptions', loadChildren: () => import('./playoptions/playoptions.module').then( m => m.PlayoptionsPageModule) }, 
    ]),
    ComponentsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}