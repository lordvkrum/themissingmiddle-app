import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { TwilioService } from '../../services/twilio';
import { AlertService } from '../../services/alert';
import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';

@Component({
	selector: 'page-register',
	templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
	registerForm: FormGroup;
	private email: string;
	private password: string;

	constructor(public navCtrl: NavController,
		private formBuilder: FormBuilder,
		private auth: AuthService,
		private user: UserService,
		private twilio: TwilioService,
		private alert: AlertService) { }

	ngOnInit(): void {
		this.buildForm();
	}

	doRegister() {
		this.email = this.registerForm.value.email;
		this.password = this.registerForm.value.password;
		this.user.create(this.email, this.password).subscribe(
			user => {
				this.auth.register(this.email, this.password).subscribe(
					user => {
						this.twilio.start(user._id).subscribe(
							result => this.navCtrl.setRoot(HomePage));
					});
			},
			error => this.alert.showError('Error with credentials. Please try again.\n' + error));
	}

	goToLogin() {
		this.navCtrl.setRoot(LoginPage);
	}

	buildForm(): void {
		this.registerForm = this.formBuilder.group({
			'email': [this.email, Validators.required],
			'password': [this.password, Validators.required]
		});
		this.registerForm.valueChanges.subscribe(
			data => this.onValueChanged(data));
		this.onValueChanged(); // (re)set validation messages now
	}

	onValueChanged(data?: any) {
		if (!this.registerForm) { return; }
		const form = this.registerForm;
		for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}

	formErrors = {
		'email': '',
		'password': ''
	};

	validationMessages = {
		'email': {
			'required': 'Email is required.'
		},
		'password': {
			'required': 'Password is required.'
		}
	};

}
