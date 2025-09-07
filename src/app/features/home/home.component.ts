import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FluidBackgroundComponent } from '../fluid-background/fluid-background.component';
import { ArticleService } from '../../core/services';
import { Article } from '../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FluidBackgroundComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentArticle = 0;
  totalArticles = 0;
  progressPercentage = 0;
  currentTime = '0:00';
  totalTime = '0:10';
  private progressInterval: any;
  private articleDuration = 10; // 10 segundos
  private currentSeconds = 0;
  public isPaused = false;
  private boundHandleKeydown: (event: KeyboardEvent) => void;
  private isChangingArticle = false; // Protección contra cambios simultáneos
  private isTimerRunning = false; // Protección contra múltiples timers

  // Articles from backend API
  articles: Article[] = [];
  loading = true;
  error: string | null = null;

  // Search functionality
  searchQuery = '';
  searchResults: Article[] = [];
  isSearching = false;
  showSearchResults = false;

  constructor(
    private cdr: ChangeDetectorRef, 
    private ngZone: NgZone,
    private router: Router,
    private articleService: ArticleService
  ) {
    this.boundHandleKeydown = this.handleKeydown.bind(this);
  }

  /**
   * Cambia al artículo especificado
   * @param articleIndex - Índice del artículo al que cambiar
   */
  goToArticle(articleIndex: number): void {
    // Protección contra cambios simultáneos
    if (this.isChangingArticle) return;
    
    if (articleIndex >= 0 && articleIndex < this.totalArticles) {
      this.isChangingArticle = true;
      
      // Detener timer actual si existe
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      
      this.currentArticle = articleIndex;
      this.resetProgress();
      
      // Permitir cambios nuevamente inmediatamente
      this.isChangingArticle = false;
    }
  }

  /**
   * Navega al siguiente artículo
   */
  nextArticle(): void {
    // Protección contra cambios simultáneos
    if (this.isChangingArticle) return;
    
    this.isChangingArticle = true;
    
    // Cambiar al siguiente artículo directamente
    const nextIndex = (this.currentArticle + 1) % this.totalArticles;
    this.currentArticle = nextIndex;
    
    // Reiniciar timer
    this.resetProgress();
    
    this.cdr.detectChanges();
    this.isChangingArticle = false;
  }

  /**
   * Navega al artículo anterior
   */
  previousArticle(): void {
    // Protección contra cambios simultáneos
    if (this.isChangingArticle) return;
    
    this.isChangingArticle = true;
    
    // Cambiar al artículo anterior directamente
    const prevIndex = (this.currentArticle - 1 + this.totalArticles) % this.totalArticles;
    this.currentArticle = prevIndex;
    
    // Reiniciar timer
    this.resetProgress();
    
    this.cdr.detectChanges();
    this.isChangingArticle = false;
  }

  /**
   * Reinicia el progreso del tiempo
   */
  private resetProgress(): void {
    // Limpiar timer actual
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    
    // Resetear variables
    this.currentSeconds = 0;
    this.progressPercentage = 0;
    this.currentTime = '0:00';
    this.isPaused = false;
    this.isTimerRunning = false;
    
    // Iniciar nuevo timer
    this.startProgressTimer();
  }

  /**
   * Inicia el temporizador de progreso optimizado
   */
  private startProgressTimer(): void {
    // Protección contra múltiples timers
    if (this.isTimerRunning || this.progressInterval) {
      return;
    }
    
    this.isTimerRunning = true;
    
    this.progressInterval = setInterval(() => {
      if (this.isPaused) return;
      
      this.currentSeconds++;
      this.progressPercentage = (this.currentSeconds / this.articleDuration) * 100;
      this.currentTime = this.formatTime(this.currentSeconds);
      
      // Solo actualizar el DOM cuando sea necesario y dentro de NgZone
      if (this.currentSeconds % 2 === 0) {
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      }
      
      // Si se completa el tiempo, pasar al siguiente artículo
      if (this.currentSeconds >= this.articleDuration) {
        // DETENER EL TIMER ACTUAL ANTES DE CAMBIAR DE ARTÍCULO
        clearInterval(this.progressInterval);
        this.progressInterval = null;
        this.isTimerRunning = false;
        
        // Cambiar al siguiente artículo dentro de NgZone
        this.ngZone.run(() => {
          this.nextArticle();
        });
      }
    }, 1000);
  }

  /**
   * Formatea el tiempo en formato MM:SS
   */
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Pausa el temporizador cuando el mouse entra al slide
   */
  pauseTimer(): void {
    this.isPaused = true;
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.isTimerRunning = false;
  }

  /**
   * Reanuda el temporizador cuando el mouse sale del slide
   */
  resumeTimer(): void {
    this.isPaused = false;
    this.startProgressTimer();
  }

  /**
   * Inicializa el componente
   */
  ngOnInit(): void {
    this.loadRecentArticles();
    
    // Configurar navegación por teclado optimizada
    document.addEventListener('keydown', this.boundHandleKeydown);
  }

  /**
   * Carga los artículos más recientes desde la API
   */
  public loadRecentArticles(): void {
    this.loading = true;
    this.error = null;

    this.articleService.getArticles().subscribe({
      next: (articles) => {
        // Ordenar por fecha de creación (más recientes primero) y tomar máximo 4
        this.articles = articles
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        
        this.totalArticles = this.articles.length;
        this.loading = false;
        
        // Solo iniciar el timer si hay artículos
        if (this.articles.length > 0) {
          this.startProgressTimer();
        }
        
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Error loading articles';
        this.loading = false;
        console.error('Error loading articles:', error);
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Busca artículos basado en la consulta
   */
  searchArticles(): void {
    if (!this.searchQuery.trim()) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        const query = this.searchQuery.toLowerCase().trim();
        this.searchResults = articles.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          (article.excerpt && article.excerpt.toLowerCase().includes(query)) ||
          (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
        );
        
        this.showSearchResults = true;
        this.isSearching = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isSearching = false;
        console.error('Error searching articles:', error);
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
    this.isSearching = false;
  }

  /**
   * Navega a un artículo específico
   */
  goToArticleDetail(article: Article): void {
    this.router.navigate(['/articles', article._id]);
  }

  /**
   * Navega a la lista de artículos
   */
  goToArticlesList(): void {
    this.router.navigate(['/articles-list']);
  }

  /**
   * Navega a la sección del equipo
   */
  goToTeamSection(): void {
    // Scroll to team section if it exists on the same page
    const teamSection = document.getElementById('team-section');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If team section is on a different page, navigate there
      this.router.navigate(['/team']);
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Extrae la duración del video desde la URL (placeholder)
   */
  getVideoDuration(videoUrl: string): string | null {
    // For now, return a placeholder duration
    // In a real implementation, you might extract this from YouTube/Vimeo APIs
    // or store duration in the database
    if (!videoUrl) return null;
    
    // Simple placeholder logic - you can enhance this based on your needs
    return '12:45'; // Default duration
  }

  /**
   * Limpia el componente al destruirlo
   */
  ngOnDestroy(): void {
    // Limpiar timer
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    
    // Resetear flags
    this.isTimerRunning = false;
    this.isChangingArticle = false;
    this.isPaused = false;
    
    // Remover event listener usando la misma referencia
    if (this.boundHandleKeydown) {
      document.removeEventListener('keydown', this.boundHandleKeydown);
      this.boundHandleKeydown = null as any;
    }
  }

  /**
   * Manejador de teclas separado para poder removerlo
   */
  private handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousArticle();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextArticle();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        event.preventDefault();
        this.goToArticle(parseInt(event.key) - 1);
        break;
      case ' ':
        event.preventDefault();
        // La pausa ahora es automática con el mouse
        break;
    }
  }
}
