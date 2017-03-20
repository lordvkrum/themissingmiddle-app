import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { HomePage } from '../../pages/home/home';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
	users: any;

	constructor(public navCtrl: NavController,
		private auth: AuthService,
		private user: UserService) { }

	ngOnInit(): void {
		this.user.getUsers().subscribe(
			users => this.users = users);
	}

	login(user) {
		this.auth.login(user.email).subscribe(
			result => this.navCtrl.setRoot(HomePage));
	}

}
