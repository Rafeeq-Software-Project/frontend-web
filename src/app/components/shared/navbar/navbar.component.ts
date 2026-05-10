import { Component, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isScrolled = false;
  isDarkMode = false;
  private themeSub!: Subscription;

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    this.themeSub = this.themeService.isDarkMode$.subscribe(dark => {
      this.isDarkMode = dark;
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  toggleTheme(event: MouseEvent): void {
    this.themeService.toggleTheme(event);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
      if (this.isScrolled && this.isMenuOpen) {
        this.isMenuOpen = false;
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
