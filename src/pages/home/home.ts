import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { ContactService } from '../../services/contact';
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
	searchResult: any;
	currentUser: any;

	constructor(public navCtrl: NavController,
		private auth: AuthService,
		private user: UserService,
		private contact: ContactService,
		private twilio: TwilioService) {
		this.auth.currentUser.subscribe(
			currentUser => this.currentUser = currentUser);
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
		this.contact.list().subscribe(
			contacts => this.contacts = contacts);
		this.contact.onCreated(this.onCreatedContact.bind(this));
	}

	onCreatedContact(contact) {
		this.contacts.push(contact);
	}

	searchContact(ev) {
		let query = ev.target.value;
		this.user.list({
			query: {
				email: query
			}
		}).subscribe(
			users => {
				this.searchResult = users.filter((user) => {
					if (this.currentUser._id === user._id) {
						return false;
					}
					let matchContacts = this.contacts.find((contact) => {
						return contact.contact._id === user._id;
					});
					if (matchContacts) {
						return false;
					}
					return true;
				});
			});
	}

	addContact(user) {
		this.contact.create(user._id).subscribe(
			user => { });
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
