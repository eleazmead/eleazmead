import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslatePipe } from '../../shared/translate.pipe';
import { FadeUpDirective } from '../../shared/fade-up.directive';

interface RsvpModel {
  name: string;
  attending: 'yes' | 'no' | '';
  guests: number;
}

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [FormsModule, TranslatePipe, FadeUpDirective],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.scss',
})
export class RsvpComponent {
  form: RsvpModel = { name: '', attending: '', guests: 1 };
  submitted = signal(false);

  onSubmit(ngForm: NgForm): void {
    if (!ngForm.valid) return;
    console.log('RSVP submitted:', this.form);
    this.submitted.set(true);
  }

  reset(): void {
    this.form = { name: '', attending: '', guests: 1 };
    this.submitted.set(false);
  }
}
