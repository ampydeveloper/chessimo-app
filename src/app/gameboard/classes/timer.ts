declare var $;

export class Timer {
    
    lastStart: any = 0;
    baseTime: any =0;
	isPaused: boolean = true;
    maxTime: any = null;
    humanString: any = '0.00';
    constructor() {
      
    }
	
	setBaseTime(seconds) {
		this.baseTime = Math.floor(seconds) * 1000;
    }
    
	reset() {
		this.lastStart = 0;
		this.baseTime = 0;
		this.isPaused = true;
    }
    
	start() {
		if (this.isPaused) {
			this.lastStart = $.now();
			this.isPaused = false;
		}
    }
    
	pause() {
		if (!this.isPaused) {
			this.isPaused = true;
			var diff = $.now()-this.lastStart;
			this.baseTime += diff;
		}
    }
    
	shiftBaseTime(millis) {
		this.baseTime += millis;
    }
    
	getTime() {
		var ret = this.baseTime;
		if (this.isPaused == false) {
			var diff = $.now()-this.lastStart;
			ret += diff;
		}
		if (this.maxTime !== null && ret > this.maxTime) {
			return this.maxTime;
		}
		return ret;
	}
	getSeconds() {
		var ret = this.getTime()/1000;
		return Math.floor(ret);
    }
    
	setMaxTime(maxTime) {
		this.maxTime = maxTime;
    }
    
	getHumanString() {
        var sec = this.getSeconds();
        this.humanString = this.secondsToHuman(sec);
		return this.humanString;
    }
    
	secondsToHuman(sec) {
		var minutes = Math.floor(sec / 60);
		sec %= 60;
		return ''+minutes+':'+(sec < 10 ? '0' : '')+sec;
	}
}

export class ReverseTimer extends Timer {

	timeLeft: any = 0;
    
    init(seconds) {
		// console.log('ReverseTimer init with '+seconds+' sec');
		this.setSecondsLeft(seconds);
    }
    
	setSecondsLeft(seconds) {
		this.timeLeft = Math.floor(seconds);
    }
    
	getSecondsLeft() {
		var ret = this.timeLeft-this.getSeconds();
		if (ret < 0) {ret = 0;}
		return ret;
    }
    
	addExtraTime(seconds) {
		if (seconds == 0.0) {return;}
		this.baseTime -= seconds*1000;
    }
    
	getHumanString() {
		var sec = this.getSecondsLeft();
        this.humanString = this.secondsToHuman(sec);
		return this.humanString;
	}
}