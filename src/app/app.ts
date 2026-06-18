import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { OurStoryComponent } from './components/our-story/our-story.component';
import { RsvpComponent } from './components/rsvp/rsvp.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { FooterComponent } from './components/footer/footer.component';
import { LanguageToggleComponent } from './shared/language-toggle/language-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    OurStoryComponent,
    RsvpComponent,
    GalleryComponent,
    FooterComponent,
    LanguageToggleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
