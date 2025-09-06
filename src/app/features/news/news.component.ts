import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NewsArticle {
  id: number;
  title: string;
  section: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  featured?: boolean;
}

@Component({
  selector: 'app-news',
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewsComponent {
  articles: NewsArticle[] = [
    {
      id: 2,
      title: 'Machine Learning in Control Theory',
      section: 'Technology',
      excerpt: 'How artificial intelligence is revolutionizing traditional control methodologies and system optimization.',
      date: 'December 10, 2024',
      imageUrl: 'assets/images/images.webp'
    },
    {
      id: 3,
      title: 'Adaptive Control Algorithms',
      section: 'Innovation',
      excerpt: 'New approaches to self-tuning controllers that adapt to changing system parameters in real-time.',
      date: 'December 5, 2024',
      imageUrl: 'assets/images/images.webp'
    },
    {
      id: 4,
      title: 'IoT Integration in Control Systems',
      section: 'Industry',
      excerpt: 'Connecting control systems to the Internet of Things for enhanced monitoring and remote management.',
      date: 'November 28, 2024',
      imageUrl: 'assets/images/images.webp'
    },
    {
      id: 5,
      title: 'Neural Network Controllers',
      section: 'AI',
      excerpt: 'Implementation of neural networks in control systems for enhanced pattern recognition and decision making.',
      date: 'November 20, 2024',
      imageUrl: 'assets/images/images.webp'
    },
    {
      id: 6,
      title: 'Predictive Control Systems',
      section: 'Innovation',
      excerpt: 'Advanced predictive algorithms that anticipate system behavior for optimal control performance.',
      date: 'November 15, 2024',
      imageUrl: 'assets/images/images.webp'
    }
  ];

  readArticle(article: NewsArticle): void {
    console.log('Reading article:', article.title);
    // Implement navigation to article detail
  }

  seeAllArticles(): void {
    console.log('Navigate to all articles');
    // Implement navigation to articles list
  }
}
