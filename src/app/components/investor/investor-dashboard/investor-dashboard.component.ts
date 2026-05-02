import { Component, HostListener, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { InvestorService, InvestorProfile } from '../../../services/investor.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-investor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './investor-dashboard.component.html',
  styleUrls: ['./investor-dashboard.component.css']
})
export class InvestorDashboardComponent implements OnInit {
  private themeService = inject(ThemeService);
  private investorService = inject(InvestorService);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  isDarkMode$ = this.themeService.isDarkMode$;
  isMobileMenuOpen = false;

  currentView: 'dashboard' | 'profile' | 'settings' | 'complete-profile' = 'dashboard';

  isLoadingProfile = true;
  isSavingProfile = false;
  profileErrorMessage = '';
  profileSuccessMessage = '';

  investorProfile: InvestorProfile | null = null;
  profilePictureUrl: string | null = null;
  userFullName: string = 'Loading...';
  userRoleTitle: string = 'Investor';

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    investorType: ['', Validators.required],
    location: ['', Validators.required],
    minInvestment: [0, [Validators.required, Validators.min(0)]],
    maxInvestment: [0, [Validators.required, Validators.min(0)]],
    stage: ['', Validators.required],
    investmentInterests: ['', Validators.required],
    bio: ['', Validators.required],
    experienceYears: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.checkProfileStatus();
  }

  checkProfileStatus(): void {
    this.isLoadingProfile = true;
    this.investorService.getMyInvestorProfile().subscribe({
      next: (data) => {
        if (!data || !data.investorType) {
          this.currentView = 'complete-profile';
        } else {
          this.hydrateProfile(data);
        }
        this.isLoadingProfile = false;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.currentView = 'complete-profile';
        this.isLoadingProfile = false;
      }
    });
  }

  hydrateProfile(data: any): void {
    this.investorProfile = data;
    const userObj = data.user || data;

    this.profilePictureUrl = userObj.profilePictureUrl || null;

    const fName = data.firstName || userObj.firstName || '';
    const lName = data.lastName || userObj.lastName || '';
    this.userFullName = `${fName} ${lName}`.trim() || 'Investor';
    this.userRoleTitle = data.investorType || 'Investor';

    this.profileForm.patchValue({
      firstName: fName,
      lastName: lName,
      investorType: data.investorType || '',
      location: data.location || '',
      minInvestment: data.minInvestment || 0,
      maxInvestment: data.maxInvestment || 0,
      stage: data.stage || '',
      investmentInterests: data.investmentInterests || '',
      bio: data.bio || '',
      experienceYears: data.experienceYears || 0
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSavingProfile = true;
    this.profileErrorMessage = '';
    this.profileSuccessMessage = '';

    const payload: InvestorProfile = this.profileForm.value;

    const request$ = this.investorProfile
      ? this.investorService.updateInvestorProfile(payload)
      : this.investorService.createInvestorProfile(payload);

    request$.subscribe({
      next: (res) => {
        this.isSavingProfile = false;

        if (this.currentView === 'complete-profile') {
          this.hydrateProfile(payload);
          this.setView('profile');
          return;
        }

        this.profileSuccessMessage = 'Profile updated successfully!';
        setTimeout(() => this.profileSuccessMessage = '', 3000);
        this.hydrateProfile(payload);
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        this.isSavingProfile = false;

        if (err.status === 405) {
          this.profileErrorMessage = '405 Method Not Allowed. Check HTTP method bindings.';
        } else {
          this.profileErrorMessage = err?.error?.message || 'Error saving profile.';
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.investorService.uploadProfilePicture(file).subscribe({
        next: (res: any) => {
          this.profilePictureUrl = res.profilePictureUrl || res.url || null;
          this.checkProfileStatus();
        },
        error: (err) => {
          console.error('Profile picture upload failed', err);
        }
      });
    }
  }

  deleteProfilePicture(): void {
    this.investorService.deleteProfilePicture().subscribe({
      next: () => {
        this.profilePictureUrl = null;
      },
      error: (err) => {
        console.error('Profile picture deletion failed', err);
      }
    });
  }

  toggleTheme(event: MouseEvent) {
    this.themeService.toggleTheme(event);
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  setView(view: 'dashboard' | 'profile' | 'settings' | 'complete-profile', event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (!this.investorProfile && view !== 'complete-profile' && view !== 'dashboard') {
      this.currentView = 'complete-profile';
      this.closeMobileMenu();
      return;
    }

    this.currentView = view;
    this.closeMobileMenu();
  }

  onNavClick(event: Event) {
    event.preventDefault();
    this.closeMobileMenu();
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (isPlatformBrowser(this.platformId)) {
      this.closeMobileMenu();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth > 768 && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  }
}
