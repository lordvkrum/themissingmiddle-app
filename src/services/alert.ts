import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertService {

	constructor(private alertCtrl: AlertController) { }

	showError(message) {
		return this.alertCtrl.create({
			title: 'Error!',
			subTitle: message,
			buttons: ['OK']
		}).present();
	}
}