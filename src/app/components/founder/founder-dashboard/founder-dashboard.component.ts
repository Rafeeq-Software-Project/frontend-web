import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  isDarkMode$ = this.themeService.isDarkMode$;

  isMobileMenuOpen = false;
  currentView: 'dashboard' | 'projects' | 'messages' = 'dashboard';

  toggleTheme() {
    this.themeService.toggleTheme();
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
    this.closeMobileMenu();
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
