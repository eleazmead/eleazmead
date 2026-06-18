import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { OurStoryComponent } from '../our-story/our-story.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { FooterComponent } from '../footer/footer.component';
import { LanguageToggleComponent } from '../../shared/language-toggle/language-toggle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    OurStoryComponent,
    RsvpComponent,
    GalleryComponent,
    FooterComponent,
    LanguageToggleComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
