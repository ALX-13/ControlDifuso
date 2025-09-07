import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/page/page.component').then(m => m.PageComponent),
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news.component').then(m => m.NewsComponent)
  },
  {
    path: 'articles',
    loadComponent: () => import('./features/articles-list/articles-list.component').then(m => m.ArticlesListComponent)
  },
  {
    path: 'interviews',
    loadComponent: () => import('./features/interviews/interviews.component').then(m => m.InterviewsComponent)
  },
  {
    path: 'elections',
    loadComponent: () => import('./features/elections/elections.component').then(m => m.ElectionsComponent)
  },
  {
    path: 'article/:id',
    loadComponent: () => import('./features/articles/articles.component').then(m => m.ArticlesComponent)
  },
  {
    path: 'interview/:id',
    loadComponent: () => import('./features/interviews/interviews.component').then(m => m.InterviewsComponent)
  },
  {
    path: 'candidate/:id',
    loadComponent: () => import('./features/elections/elections.component').then(m => m.ElectionsComponent)
  },
  {
    path: 'team',
    loadComponent: () => import('./features/team/team.component').then(m => m.TeamComponent)
  },
  {
    path: 'goto',
    loadComponent: () => import('./features/goto/goto.component').then(m => m.GotoComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
