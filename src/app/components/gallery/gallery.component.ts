import { Component, signal } from '@angular/core';
import { TranslatePipe } from '../../shared/translate.pipe';
import { FadeUpDirective } from '../../shared/fade-up.directive';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [TranslatePipe, FadeUpDirective],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  readonly tiles = Array.from({ length: 9 }, (_, i) => i);
  readonly selectedIndex = signal<number | null>(null);

  open(index: number): void {
    this.selectedIndex.set(index);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.selectedIndex.set(null);
    document.body.style.overflow = '';
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
