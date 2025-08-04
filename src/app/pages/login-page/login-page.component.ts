import { Component } from '@angular/core';
import { LoginComponent } from '../../components/login-component/login.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent],
  template: '<app-login></app-login>'
})
export class LoginPageComponent {}