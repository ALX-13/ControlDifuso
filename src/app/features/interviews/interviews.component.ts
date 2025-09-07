import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InterviewService } from '../../core/services';
import { Interview } from '../../core/models';

@Component({
  selector: 'app-interviews',
  imports: [CommonModule],
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class InterviewsComponent implements OnInit {
  interviews: Interview[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private interviewService: InterviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInterviews();
  }

  loadInterviews() {
    this.loading = true;
    this.interviewService.getInterviews().subscribe({
      next: (interviews) => {
        this.interviews = interviews;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Error al cargar las entrevistas';
        this.loading = false;
        console.error('Error loading interviews:', error);
        this.cdr.markForCheck();
      }
    });
  }

  viewInterview(interview: Interview) {
    this.router.navigate(['/interview', interview._id]);
  }

  public formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  public getVideoThumbnail(videoUrl: string): string {
    // For now, return a placeholder image
    // In a real app, you might extract thumbnail from YouTube/Vimeo URLs
    return '/assets/images/video-placeholder.jpg';
  }

  public getExcerpt(text: string, maxLength: number = 150): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  public trackByInterviewId(index: number, interview: Interview): string {
    return interview._id || index.toString();
  }
}
