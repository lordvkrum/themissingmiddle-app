import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { MessageService } from '../../services/message';
import { TwilioService } from '../../services/twilio';
import { CallPage } from '../../pages/call/call';

@Component({
	selector: 'page-chat',
	templateUrl: 'chat.html'
})
export class ChatPage implements OnInit {
	@ViewChild('messagesList') messagesList;
	newMessageForm: FormGroup;
	newMessageText: string;
	contact: any = {};
	messages: any;

	constructor(public navCtrl: NavController,
		public params: NavParams,
		private formBuilder: FormBuilder,
		private auth: AuthService,
		private message: MessageService,
		private twilio: TwilioService) {
		this.twilio.callStatus.subscribe(
			result => {
				const activePage = this.navCtrl.getActive();
				if (activePage.component.name !== 'ChatPage') {
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
		this.contact = this.params.data;
		this.message.list().subscribe(
			messages => {
				this.messages = messages;
				this.scrollToBottom();
			});
		this.message.onCreated(this.onCreatedMessage.bind(this));
		this.buildForm();
	}

	scrollToBottom() {
		setTimeout(() => {
			this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight
		}, 0);
	}

	onCreatedMessage(message) {
		this.messages.push(message);
		this.scrollToBottom();
	}

	buildForm(): void {
		this.newMessageForm = this.formBuilder.group({
			'newMessageText': [this.newMessageText, Validators.required]
		});
	}

	newMessage() {
		this.newMessageText = this.newMessageForm.value.newMessageText;
		this.message.create(this.newMessageText).subscribe(
			message => this.newMessageForm.setValue({ newMessageText: '' }));
	}

	call() {
		this.twilio.makeCall(this.contact);
	}

}
