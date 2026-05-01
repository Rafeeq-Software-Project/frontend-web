import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FounderService, FounderProfile } from '../../../services/founder.service';
import { UserService } from '../../../services/user.service';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-founder-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  profile: FounderProfile | null = null;
  isLoading = false;
  isSaving = false;
  isDarkMode = false;
  successMessage = '';
  errorMessage = '';
  
  private themeSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private founderService: FounderService,
    private userService: UserService,
    private themeService: ThemeService
  ) {
    this.profileForm = this.fb.group({
      companyName: ['', [Validators.required]],
      companyRegistrationNumber: [''],
      industry: ['', [Validators.required]],
      bio: [''],
      websiteUrl: ['', [Validators.pattern('https?://.+')]],
      linkedInProfile: ['', [Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.themeSub = this.themeService.isDarkMode$.subscribe(dark => {
      this.isDarkMode = dark;
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.founderService.getCurrentProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.profileForm.patchValue({
          companyName: data.companyName,
          companyRegistrationNumber: data.companyRegistrationNumber,
          industry: data.industry,
          bio: data.bio,
          websiteUrl: data.websiteUrl,
          linkedInProfile: data.linkedInProfile
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.founderService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.isSaving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.isSaving = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isSaving = true;
      this.userService.uploadProfilePicture(file).subscribe({
        next: (res) => {
          this.loadProfile();
          this.isSaving = false;
          this.successMessage = 'Profile picture updated!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to upload image.';
          this.isSaving = false;
        }
      });
    }
  }

  deletePicture(): void {
    if (confirm('Are you sure you want to delete your profile picture?')) {
      this.isSaving = true;
      this.userService.deleteProfilePicture().subscribe({
        next: () => {
          this.loadProfile();
          this.isSaving = false;
          this.successMessage = 'Profile picture deleted.';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete image.';
          this.isSaving = false;
        }
      });
    }
  }

  toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }
}
