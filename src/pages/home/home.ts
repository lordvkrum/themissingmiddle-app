import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { TwilioService } from '../../services/twilio';
import { LoginPage } from '../../pages/login/login';
import { ChatPage } from '../../pages/chat/chat';
import { CallPage } from '../../pages/call/call';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit {
	contacts: any;

	constructor(public navCtrl: NavController,
		private auth: AuthService,
		private user: UserService,
		private twilio: TwilioService) {
		this.twilio.callStatus.subscribe(
			result => {
				const activePage = this.navCtrl.getActive();
				if (activePage.component.name !== 'HomePage') {
					return;
				}
				switch (result.status) {
					case 'inbound':
					case 'outbound':
						this.navCtrl.push(CallPage, result);
						break;
				}
			});
	}

	ngOnInit(): void {
		this.user.listContacts().subscribe(
			contacts => this.contacts = contacts);
	}

	logout() {
		this.auth.logout().subscribe(
			result => {
				this.twilio.clearClient();
				this.navCtrl.setRoot(LoginPage)
			});
	}

	chat(contact) {
		this.navCtrl.push(ChatPage, contact);
	}

}
