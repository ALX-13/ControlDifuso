
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private hamburgerMenu: HTMLElement | null = null;
  private navMenu: HTMLElement | null = null;
  private themeToggle: HTMLElement | null = null;
  private header: HTMLElement | null = null;
  public isDarkMode: boolean = true; // Por defecto modo oscuro

  ngOnInit() {
    this.initializeMenu();
    this.initializeTheme();
    this.initializeScrollEffect();
  }

  ngOnDestroy() {
    this.removeEventListeners();
    this.removeScrollListener();
  }

  private initializeMenu() {
    this.hamburgerMenu = document.getElementById('hamburger-menu');
    this.navMenu = document.getElementById('nav-menu');

    if (this.hamburgerMenu && this.navMenu) {
      this.hamburgerMenu.addEventListener('click', this.toggleMenu.bind(this));
      
      // Cerrar menú al hacer clic en un enlace
      const menuItems = this.navMenu.querySelectorAll('.text');
      menuItems.forEach(item => {
        item.addEventListener('click', this.closeMenu.bind(this));
      });

      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }
  }

  private initializeTheme() {
    this.themeToggle = document.querySelector('.theme-toggle');
    
    // Cargar tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    }
    
    this.applyTheme();
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }
  }

  private toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    
    // Guardar preferencia en localStorage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    const body = document.body;
    const html = document.documentElement;
    
    if (this.isDarkMode) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      html.setAttribute('data-theme', 'dark');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      html.setAttribute('data-theme', 'light');
    }
  }

  private toggleMenu() {
    if (this.hamburgerMenu && this.navMenu) {
      this.hamburgerMenu.classList.toggle('active');
      this.navMenu.classList.toggle('active');
      
      // Prevenir scroll del body cuando el menú está abierto
      if (this.navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  private closeMenu() {
    if (this.hamburgerMenu && this.navMenu) {
      this.hamburgerMenu.classList.remove('active');
      this.navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  private handleOutsideClick(event: Event) {
    if (this.hamburgerMenu && this.navMenu) {
      const target = event.target as HTMLElement;
      if (!this.hamburgerMenu.contains(target) && !this.navMenu.contains(target)) {
        this.closeMenu();
      }
    }
  }

  private initializeScrollEffect() {
    this.header = document.querySelector('.header');
    if (this.header) {
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  private handleScroll() {
    if (this.header) {
      if (window.scrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }
  }

  private removeScrollListener() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  private removeEventListeners() {
    document.body.style.overflow = '';
    if (this.hamburgerMenu) {
      this.hamburgerMenu.removeEventListener('click', this.toggleMenu.bind(this));
    }
    if (this.themeToggle) {
      this.themeToggle.removeEventListener('click', this.toggleTheme.bind(this));
    }
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }
}
