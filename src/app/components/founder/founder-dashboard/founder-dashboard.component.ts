import { Component, HostListener, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MyProjectComponent } from '../my-project/my-project.component';
import { ChatComponent } from '../chat/chat.component';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-founder-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MyProjectComponent,
    ChatComponent
  ],
  templateUrl: './founder-dashboard.component.html',
  styleUrls: ['./founder-dashboard.component.css']
})
export class FounderDashboardComponent {
  private themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);
  isDarkMode$ = this.themeService.isDarkMode$;

  isMobileMenuOpen = false;
  currentView: 'dashboard' | 'projects' | 'messages' = 'dashboard';

  toggleTheme(event: MouseEvent) {
    this.themeService.toggleTheme(event);
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  setView(view: 'dashboard' | 'projects' | 'messages', event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.currentView = view;
    this.closeMobileMenu();
  }

  onNavClick(event: Event) {
    event.preventDefault();
    this.closeMobileMenu();
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
