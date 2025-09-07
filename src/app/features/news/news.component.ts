import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArticleService } from '../../core/services';
import { Article } from '../../core/models';

@Component({
  selector: 'app-news',
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewsComponent implements OnInit {
  articles: Article[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadLatestArticles();
  }

  public loadLatestArticles() {
    this.loading = true;
    this.error = null;

    this.articleService.getArticles().subscribe({
      next: (articles) => {
        // Get the latest 5 articles, sorted by creation date
        this.articles = articles
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.error = 'Error loading articles';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  readArticle(article: Article): void {
    this.router.navigate(['/article', article._id]);
  }

  seeAllArticles(): void {
    this.router.navigate(['/articles']);
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
