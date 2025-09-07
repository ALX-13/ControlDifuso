import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-goto',
  imports: [],
  templateUrl: './goto.component.html',
  styleUrl: './goto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GotoComponent {
  constructor(private router: Router) {}

  viewMoreArticles() {
    this.router.navigate(['/articles']);
  }
}
