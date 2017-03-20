import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { TwilioService } from '../../services/twilio';
import { HomePage } from '../../pages/home/home';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
	users: any;

	constructor(public navCtrl: NavController,
		private auth: AuthService,
		private user: UserService,
		private twilio: TwilioService) { }

	ngOnInit(): void {
		this.user.list().subscribe(
			users => this.users = users);
	}

	login(user) {
		this.auth.login(user.email).subscribe(
			user => {
				this.twilio.start(user._id).subscribe(
					result => this.navCtrl.setRoot(HomePage));
			});
	}

}
