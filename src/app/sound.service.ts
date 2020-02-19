import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from './user.service';
import { Media, MediaObject } from '@ionic-native/media/ngx';


@Injectable({
  providedIn: 'root'
})
export class SoundService {

 SoundType = {
      WRONG_MOVE: 1,
      WRONG_COLOR: 2,
      MOVE: 3,
      END: 4,
      TIME: 5,
  };  

  androidBaseAudioPath = "/android_asset/www/assets/chess/audio/";
  iosBaseAudioPath = "assets/chess/audio/";

  makesoundObj = (soundType) => {
    
    if (!this.userService.gameSetting.soundEnabled) {
      return;
    }

    if(!this.platform.is('desktop')) {
        var path = (this.platform.is('ios') ? this.iosBaseAudioPath : this.androidBaseAudioPath) + this.getSoundFileName(soundType);
        // var mediaPlay = new Media(path,
        //     // success callback
        //     function () {
        //         mediaPlay.release();
        //     },
        //     // error callback
        //     function (err) {
        //         mediaPlay.release();
        //     });
        const mediaPlay: MediaObject = this.media.create(path);
        mediaPlay.play();
        mediaPlay.onSuccess.subscribe(() => {
          console.log('Action is successful');
          mediaPlay.release();
        });
    }
  }

  constructor(public platform: Platform, public userService: UserService, public media: Media) { }

  makesound(soundType) {
    
    if (!this.userService.gameSetting.soundEnabled) {
      return;
    }

    if(!this.platform.is('desktop')) {
        var path = (this.platform.is('ios') ? this.iosBaseAudioPath : this.androidBaseAudioPath) + this.getSoundFileName(soundType);
        // var mediaPlay = new Media(path,
        //     // success callback
        //     function () {
        //         mediaPlay.release();
        //     },
        //     // error callback
        //     function (err) {
        //         mediaPlay.release();
        //     });
        const mediaPlay: MediaObject = this.media.create(path);
        mediaPlay.play();
        mediaPlay.onSuccess.subscribe(() => {
          console.log('Action is successful');
          mediaPlay.release();
        });
        
    }
  }

  
  getSoundFileName(soundType) {
      switch (soundType) {
          case this.SoundType.WRONG_MOVE:
              return "wrongMove.mp3";
          case this.SoundType.WRONG_COLOR:
              return "wrongColor.mp3";
          case this.SoundType.MOVE:
              return "move.mp3"
          case this.SoundType.END:
              return "end.mp3"
          case this.SoundType.TIME:
              return "time.mp3";
          default:
              return "end.mp3";
      }
  }
}
