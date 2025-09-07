import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { GotoComponent } from '../goto/goto.component';
import { TeamComponent } from '../team/team.component';
import { NewsComponent } from '../news/news.component';
import { FotterComponent } from '../../shared/fotter/fotter.component';

@Component({
  selector: 'app-page',
  imports: [HomeComponent, AboutComponent, GotoComponent, TeamComponent, NewsComponent, FotterComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent { }
