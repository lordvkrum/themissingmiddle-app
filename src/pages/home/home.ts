import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
// import { HomePage } from '../../pages/home/home';

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
		this.user.getContacts().subscribe(
			contacts => this.contacts = contacts);
	}

	chat(contact) {
		console.log('chat', contact);
		// this.auth.login(user.email).subscribe(
		// 	result => this.navCtrl.setRoot(HomePage));
	}

}
