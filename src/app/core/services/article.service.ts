import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../envs/enviroment';
import { Article, CreateArticleRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  createArticle(article: CreateArticleRequest): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  updateArticle(id: string, article: Partial<CreateArticleRequest>): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, article);
  }

  deleteArticle(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getFeaturedArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}?featured=true`);
  }

  getArticlesBySection(section: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}?section=${section}`);
  }
}
