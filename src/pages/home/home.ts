import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { LoginPage } from '../../pages/login/login';
import { ChatPage } from '../../pages/chat/chat';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	contacts: any;

	constructor(public navCtrl: NavController,
		private auth: AuthService,
		private user: UserService) { }

	ngOnInit(): void {
		this.user.listContacts().subscribe(
			contacts => this.contacts = contacts);
	}

	logout() {
		this.auth.logout().subscribe(
			result => this.navCtrl.setRoot(LoginPage));
	}

	chat(contact) {
		this.navCtrl.push(ChatPage, contact);
	}

}
