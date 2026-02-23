import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WhoIsRafeeqComponent } from './components/who-is-rafeeq/who-is-rafeeq.component';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { VerifyYourEmailComponent } from './components/verify-your-email/verify-your-email.component';
import { FounderDashboardComponent } from './components/founder/founder-dashboard/founder-dashboard.component';
import { InvestorDashboardComponent } from './components/investor/investor-dashboard/investor-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'who-is-rafeeq', component: WhoIsRafeeqComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'verify-email', component: VerifyYourEmailComponent },

    {
        path: 'founder-dashboard',
        component: FounderDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: [2] }
    },
    {
        path: 'investor-dashboard',
        component: InvestorDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: [3] }
    },
    { path: '**', redirectTo: '' }
];
