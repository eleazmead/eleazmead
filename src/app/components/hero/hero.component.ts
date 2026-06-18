import { Component } from '@angular/core';
import { APP_CONFIG } from '../../config/app.config';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly config = APP_CONFIG;
}
