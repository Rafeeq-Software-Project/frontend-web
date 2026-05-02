import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WhoIsRafeeqComponent } from './components/who-is-rafeeq/who-is-rafeeq.component';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { VerifyYourEmailComponent } from './components/verify-your-email/verify-your-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FounderLayoutComponent } from './components/founder/layout/layout.component';
import { DashboardComponent as FounderDashboard } from './components/founder/dashboard/dashboard.component';
import { ProjectsComponent as FounderProjects } from './components/founder/projects/projects.component';
import { ArchiveComponent as FounderArchive } from './components/founder/archive/archive.component';
import { SettingsComponent as FounderSettings } from './components/founder/settings/settings.component';
import { CreateProjectComponent } from './components/founder/create-project/create-project.component';
import { DraftsComponent } from './components/founder/drafts/drafts.component';
import { InvestorDashboardComponent } from './components/investor/investor-dashboard/investor-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'who-is-rafeeq', component: WhoIsRafeeqComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'verify-email', component: VerifyYourEmailComponent },

    // ── Forgot Password Flow ──
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'verify-code', component: VerifyCodeComponent },
    { path: 'reset-password', component: ResetPasswordComponent },

    // ── Founder System ──
    {
        path: 'founder',
        component: FounderLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: [2] },
        children: [
            { path: 'dashboard', component: FounderDashboard },
            { path: 'projects', component: FounderProjects },
            { path: 'archive', component: FounderArchive },
            { path: 'drafts', component: DraftsComponent },
            { path: 'settings', component: FounderSettings },
            { path: 'projects/create', component: CreateProjectComponent },
            { path: 'projects/:id', loadComponent: () => import('./components/founder/project-details/project-details.component').then(m => m.ProjectDetailsComponent) },
            { path: 'projects/:id/edit', component: CreateProjectComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    {
        path: 'investor-dashboard',
        component: InvestorDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: [3] }
    },
    { path: '**', redirectTo: '' }
];
