import { Component } from '@angular/core';
import { UserDashboardComponent } from '../../components/user-dashboard-component/user-dashboard.component';

@Component({
  selector: 'app-userdashboard-page',
  standalone: true,
  imports: [UserDashboardComponent],
  template: '<app-user-dashboard></app-user-dashboard>'
})
export class UserDashboardPageComponent {}