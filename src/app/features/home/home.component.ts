import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FluidBackgroundComponent } from '../fluid-background/fluid-background.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FluidBackgroundComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentArticle = 0;
  totalArticles = 4;
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

  // Datos de los artículos
  articles = [
    {
      title: 'EL CONTROL DIFUSO',
      subtitle: 'en la Jurisprudencia Mexicana',
      description: 'Un análisis profundo sobre la evolución del control difuso en México, explorando sus fundamentos constitucionales.',
      author: 'Dr. María González',
      date: 'July 15, 2024',
      videoDuration: '12:45'
    },
    {
      title: 'LA SUPREMACÍA CONSTITUCIONAL',
      subtitle: 'y el Control de Convencionalidad',
      description: 'Estudio comparativo sobre la aplicación del control de convencionalidad en el sistema jurídico mexicano.',
      author: 'Dr. Carlos Mendoza',
      date: 'July 20, 2024',
      videoDuration: '15:30'
    },
    {
      title: 'EL AMPARO INDIRECTO',
      subtitle: 'como Mecanismo de Control',
      description: 'Análisis de la evolución del amparo indirecto y su papel en el control constitucional difuso.',
      author: 'Dra. Ana Rodríguez',
      date: 'July 25, 2024',
      videoDuration: '18:20'
    },
    {
      title: 'LA INTERPRETACIÓN CONSTITUCIONAL',
      subtitle: 'en la Era Digital',
      description: 'Reflexiones sobre cómo la tecnología está transformando la interpretación constitucional en México.',
      author: 'Dr. Luis Torres',
      date: 'July 30, 2024',
      videoDuration: '14:15'
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {
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
    this.startProgressTimer();
    
    // Configurar navegación por teclado optimizada
    document.addEventListener('keydown', this.boundHandleKeydown);
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
