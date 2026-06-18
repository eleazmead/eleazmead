import { Component } from '@angular/core';
import { APP_CONFIG } from '../../config/app.config';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly config = APP_CONFIG;
}
