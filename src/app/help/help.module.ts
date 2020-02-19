import { HowToTrainPage } from './how-to-train/how-to-train.page';
import { GameDatabasePage } from './game-database/game-database.page';
import { ChessTipsPage } from './chess-tips/chess-tips.page';
import { ChessRulesPage } from './chess-rules/chess-rules.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HelpPage } from './help.page';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: HelpPage
  },
  { path: 'chess-rules', loadChildren: './chess-rules/chess-rules.module#ChessRulesPageModule' },
  { path: 'chess-tips', loadChildren: './chess-tips/chess-tips.module#ChessTipsPageModule' },
  { path: 'how-to-train', loadChildren: './how-to-train/how-to-train.module#HowToTrainPageModule' },
  { path: 'game-database', loadChildren: './game-database/game-database.module#GameDatabasePageModule' },
  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}
