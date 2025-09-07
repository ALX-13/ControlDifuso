export interface Article {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  section: 'Tecnología' | 'Política' | 'Entrevista';
  date: Date;
  author: string;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleRequest {
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  section: 'Tecnología' | 'Política' | 'Entrevista';
  author: string;
  featured?: boolean;
  tags?: string[];
}
