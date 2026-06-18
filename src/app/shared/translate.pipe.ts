import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private ts = inject(TranslationService);

  transform(key: string): string {
    return this.ts.t(key);
  }
}
