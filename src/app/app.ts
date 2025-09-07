import { Component, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { LoadingScreenComponent } from './shared/loading-screen/loading-screen.component';
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, LoadingScreenComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('ControlDifuso');
  
  // Loading state - only for home page
  isLoading = false;
  isHomePage = false;
  
  private cursor: HTMLElement | null = null;
  private isMouseMoving = false;
  private mouseX = 0;
  private mouseY = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.createCustomCursor();
    this.checkCurrentRoute();
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkCurrentRoute();
    });
  }

  private checkCurrentRoute() {
    this.isHomePage = this.router.url === '/' || this.router.url === '/home';
    if (this.isHomePage && !this.isLoading) {
      this.isLoading = true;
    } else if (!this.isHomePage) {
      this.isLoading = false;
    }
  }

  onLoadingComplete() {
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.removeCustomCursor();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.isMouseMoving = true;
    this.updateCursorPosition();
  }
 
  @HostListener('document:mouseleave')
  onMouseLeave() {
    this.hideCursor();
  }

  @HostListener('document:mouseenter')
  onMouseEnter() {
    this.showCursor();
  }

  private createCustomCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);

    // Agregar event listeners para elementos interactivos
    this.addInteractiveListeners();
  }

  private removeCustomCursor() {
    if (this.cursor) {
      this.cursor.remove();
      this.cursor = null;
    }
  }

  private updateCursorPosition() {
    if (this.cursor) {
      this.cursor.style.left = this.mouseX + 'px';
      this.cursor.style.top = this.mouseY + 'px';
    }
  }

  private showCursor() {
    if (this.cursor) {
      this.cursor.classList.remove('hidden');
    }
  }

  private hideCursor() {
    if (this.cursor) {
      this.cursor.classList.add('hidden');
    }
  }

  private addInteractiveListeners() {
    // Elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .nav-item, .search-container, .theme-toggle, .hamburger-menu');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (this.cursor) {
          this.cursor.classList.add('hover');
        }
      });

      element.addEventListener('mouseleave', () => {
        if (this.cursor) {
          this.cursor.classList.remove('hover');
        }
      });

      element.addEventListener('mousedown', () => {
        if (this.cursor) {
          this.cursor.classList.add('click');
        }
      });

      element.addEventListener('mouseup', () => {
        if (this.cursor) {
          this.cursor.classList.remove('click');
        }
      });
    });

    // Escuchar cambios en el DOM para nuevos elementos
    const observer = new MutationObserver(() => {
      this.addInteractiveListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}
