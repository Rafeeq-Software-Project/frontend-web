import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { FounderService, FounderProfile } from '../../../services/founder.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-founder-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class FounderLayoutComponent implements OnInit, OnDestroy {
  isSidebarOpen = true;
  isDarkMode = false;
  profile: FounderProfile | null = null;
  private themeSub!: Subscription;
  private authService = inject(AuthService);

  constructor(
    private themeService: ThemeService,
    private founderService: FounderService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.isDarkMode$.subscribe(dark => {
      this.isDarkMode = dark;
    });

    this.loadProfile();

    if (isPlatformBrowser(this.platformId) && window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  loadProfile(): void {
    this.founderService.getCurrentProfile().subscribe({
      next: (data) => this.profile = data,
      error: (err) => console.error('Error loading profile', err)
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
