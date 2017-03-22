import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user';
import { TwilioService } from '../../services/twilio';

@Component({
	selector: 'page-call',
	templateUrl: 'call.html'
})
export class CallPage implements OnInit {
	statusTitle = '';
	status = '';
	contact = {};
	microphoneStatus = true;
	speakerStatus = false;
	callTimer;
	callTimerCounter;
	callTimerInterval;

	constructor(public navCtrl: NavController,
		public params: NavParams,
		private user: UserService,
		private twilio: TwilioService) {
		this.twilio.callStatus.subscribe(
			result => {
				console.log('call status', result.status);
				switch (result.status) {
					case 'outbound':
						this.statusTitle = 'Outbound';
						this.status = 'outbound';
						break;
					case 'disconnected':
						const activePage = this.navCtrl.getActive();
						if (activePage.component.name === 'CallPage') {
							this.navCtrl.pop().catch(() => { });
						}
						break;
					case 'inbound':
						this.statusTitle = 'Inbound';
						this.status = 'inbound';
						break;
					case 'answered':
						this.statusTitle = 'On Call';
						this.status = 'answered';
						this.callTimerCounter = 0;
						this.callTimer = this.formatTimer(this.callTimerCounter);
						this.callTimerInterval = setInterval(() => {
							this.callTimer = this.formatTimer(++this.callTimerCounter);
						}, 1000);
						break;
				}
			});
	}

	ngOnInit(): void {
		this.user.get((this.params.data.To || this.params.data.From).slice(7)).subscribe(
			user => this.contact = user);
	}

	fillZeros(number) {
		return number < 10 ? `0${number}` : number;
	}

	formatTimer(time) {
		var minutes = Math.floor(time / 60);
		var seconds = time % 60;
		return `${this.fillZeros(minutes)}:${this.fillZeros(seconds)}`;
	}

	connectCall() {
		this.twilio.connectCall();
	}

	rejectCall() {
		switch (this.status) {
			case 'inbound':
				this.twilio.rejectCall();
				break;
			case 'outbound':
			case 'answered':
				this.twilio.hangupCall();
				break;
		}
	}

	toggleMicrophone() {
		this.microphoneStatus = !this.microphoneStatus;
		this.twilio.toggleMicrophone(this.microphoneStatus);
	}

}
