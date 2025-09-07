import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../core/services';
import { Article } from '../../core/models';

@Component({
  selector: 'app-articles',
  imports: [CommonModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent implements OnInit {
  articleId: string | null = null;
  article: Article | null = null;
  allArticles: Article[] = [];
  loading = true;
  error: string | null = null;
  sidebarLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAllArticles();
    
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe(params => {
      this.articleId = params.get('id');
      if (this.articleId) {
        this.loadArticle();
      }
    });
  }

  public loadArticle() {
    if (!this.articleId) return;

    this.loading = true;
    this.error = null;

    this.articleService.getArticleById(this.articleId).subscribe({
      next: (article) => {
        this.article = article;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Failed to load article. Please try again.';
        this.loading = false;
        console.error('Error loading article:', error);
        this.cdr.markForCheck();
      }
    });
  }

  public formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  public loadAllArticles() {
    this.sidebarLoading = true;
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.allArticles = articles.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.sidebarLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading articles for sidebar:', error);
        this.sidebarLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  public selectArticle(article: Article): void {
    this.articleId = article._id || null;
    this.router.navigate(['/article', article._id]);
    this.loadArticle();
  }

  public getOtherArticles(): Article[] {
    return this.allArticles.filter(article => article._id !== this.articleId);
  }

  public goBack(): void {
    this.router.navigate(['/articles-list']);
  }
}
