import { Component } from '@angular/core';
import { TranslatePipe } from '../../shared/translate.pipe';
import { FadeUpDirective } from '../../shared/fade-up.directive';

@Component({
  selector: 'app-our-story',
  standalone: true,
  imports: [TranslatePipe, FadeUpDirective],
  templateUrl: './our-story.component.html',
  styleUrl: './our-story.component.scss',
})
export class OurStoryComponent {}
