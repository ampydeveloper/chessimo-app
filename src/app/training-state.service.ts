import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrainingStateService {

  categories = {
    tactics: { index: 0 },
    startegy: { index: 1 },
    endgame: { index: 2 },
    commented_endgame: { index: 3 },
    opening: { index: 4 }
  };

  CHO_CAT_ALL = -1;
  CHO_CAT_TACTICS = 0;
  CHO_CAT_STRATEGY = 1;
  CHO_CAT_ENDGAME = 2;
  CHO_CAT_COMMENTED_ENDGAME = 3;
  CHO_CAT_OPENING = 4;

  constructor() { }
}
