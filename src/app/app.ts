import { Component, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { GotoComponent } from './features/goto/goto.component';
import { TeamComponent } from './features/team/team.component';
import { FotterComponent } from './shared/fotter/fotter.component';
import { NewsComponent } from './features/news/news.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, HomeComponent, AboutComponent, GotoComponent, FotterComponent, TeamComponent, NewsComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('ControlDifuso');
  
  private cursor: HTMLElement | null = null;
  private isMouseMoving = false;
  private mouseX = 0;
  private mouseY = 0;

  ngOnInit() {
    this.createCustomCursor();
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
