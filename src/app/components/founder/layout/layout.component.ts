import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { FounderService, FounderProfile } from '../../../services/founder.service';
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
