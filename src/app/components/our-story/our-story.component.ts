import { Component } from '@angular/core';
import { TranslatePipe } from '../../shared/translate.pipe';
import { FadeUpDirective } from '../../shared/fade-up.directive';
import { APP_CONFIG } from '../../config/app.config';

@Component({
  selector: 'app-our-story',
  standalone: true,
  imports: [TranslatePipe, FadeUpDirective],
  templateUrl: './our-story.component.html',
  styleUrl: './our-story.component.scss',
})
export class OurStoryComponent {
  readonly images = APP_CONFIG.sections.ourStory.images;
}
