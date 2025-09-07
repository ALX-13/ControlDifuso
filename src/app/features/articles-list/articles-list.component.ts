import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArticleService } from '../../core/services';
import { Article } from '../../core/models';

@Component({
  selector: 'app-articles-list',
  imports: [CommonModule],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ArticlesListComponent implements OnInit {
  articles: Article[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.loading = true;
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles = articles;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Error al cargar los artículos';
        this.loading = false;
        console.error('Error loading articles:', error);
        this.cdr.markForCheck();
      }
    });
  }

  readArticle(article: Article) {
    this.router.navigate(['/articles', article._id]);
  }

  trackByArticleId(index: number, article: Article): string {
    return article._id || index.toString();
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
