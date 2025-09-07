import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../core/services';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  @Output() loadingComplete = new EventEmitter<void>();
  
  loadingProgress = 0;
  loadingText = 'Iniciando Control Difuso...';
  isVisible = true;
  
  private loadingSteps = [
    { text: 'Iniciando Control Difuso...', duration: 800 },
    { text: 'Conectando con el servidor...', duration: 1200 },
    { text: 'Cargando artículos recientes...', duration: 1000 },
    { text: 'Preparando la experiencia...', duration: 800 },
    { text: 'Casi listo...', duration: 600 }
  ];
  
  private currentStep = 0;
  private progressInterval: any;
  private stepTimeout: any;

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.startLoadingSequence();
  }

  ngOnDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    if (this.stepTimeout) {
      clearTimeout(this.stepTimeout);
    }
  }

  private startLoadingSequence() {
    // Start progress animation
    this.progressInterval = setInterval(() => {
      if (this.loadingProgress < 100) {
        this.loadingProgress += Math.random() * 3 + 1;
        if (this.loadingProgress > 100) {
          this.loadingProgress = 100;
        }
      }
    }, 50);

    // Execute loading steps
    this.executeLoadingStep();
    
    // Test backend connection in parallel
    this.testBackendConnection();
  }

  private executeLoadingStep() {
    if (this.currentStep < this.loadingSteps.length) {
      const step = this.loadingSteps[this.currentStep];
      this.loadingText = step.text;
      
      this.stepTimeout = setTimeout(() => {
        this.currentStep++;
        this.executeLoadingStep();
      }, step.duration);
    } else {
      // All steps completed, ensure progress is at 100%
      this.loadingProgress = 100;
      setTimeout(() => {
        this.completeLoading();
      }, 500);
    }
  }

  private testBackendConnection() {
    // Test API connection to ensure backend is ready
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        console.log('✅ Backend connection successful:', articles.length, 'articles loaded');
      },
      error: (error) => {
        console.warn('⚠️ Backend connection issue:', error);
        // Continue anyway after minimum loading time
      }
    });
  }

  private completeLoading() {
    // Fade out animation
    this.isVisible = false;
    
    // Wait for fade out animation to complete
    setTimeout(() => {
      this.loadingComplete.emit();
    }, 800);
  }
}
