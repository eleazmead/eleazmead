import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { SheetsService } from '../../shared/sheets.service';
import { GuestRow, RsvpEntry } from '../../shared/models/guest.model';
import { environment } from '../../../environments/environment';
import { APP_CONFIG } from '../../config/app.config';

interface AdminRow {
  guestName: string;
  partyOf: string;
  meal: string;
  rsvp: 'Yes' | 'No' | 'Pending';
  dateSubmitted: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private readonly sheets = inject(SheetsService);

  readonly authenticated = signal(false);
  readonly passwordInput = signal('');
  readonly loginError = signal('');
  readonly loading = signal(false);
  readonly fetchError = signal('');
  readonly guestRows = signal<GuestRow[]>([]);
  readonly lastRefreshed = signal<Date | null>(null);

  readonly couple = APP_CONFIG.couple;
  readonly beefLabel = APP_CONFIG.sections.mainCourse.options[0].label;
  readonly fishLabel = APP_CONFIG.sections.mainCourse.options[1].label;

  readonly adminRows = computed((): AdminRow[] => {
    const rows: AdminRow[] = [];
    for (const g of this.guestRows()) {
      const members = [g.fullName, g.guest1Name, g.guest2Name].filter((n) => n.trim());
      const entries: RsvpEntry[] = g.rsvpRaw?.[g.fullName] ?? [];
      for (const member of members) {
        const entry = entries.find((e) => e.Guest === member);
        rows.push({
          guestName: member,
          partyOf: g.fullName,
          meal: entry?.MealChoice === 'beef' ? this.beefLabel : entry?.MealChoice === 'fish' ? this.fishLabel : '—',
          rsvp: entry ? (entry.RSVP ? 'Yes' : 'No') : 'Pending',
          dateSubmitted: entry ? this.formatDate(entry.Date) : '—',
        });
      }
    }
    return rows;
  });

  readonly summary = computed(() => {
    const rows = this.adminRows();
    return {
      total: rows.length,
      attending: rows.filter((r) => r.rsvp === 'Yes').length,
      declined: rows.filter((r) => r.rsvp === 'No').length,
      pending: rows.filter((r) => r.rsvp === 'Pending').length,
      beef: rows.filter((r) => r.rsvp === 'Yes' && r.meal === this.beefLabel).length,
      fish: rows.filter((r) => r.rsvp === 'Yes' && r.meal === this.fishLabel).length,
    };
  });

  onPasswordChange(value: string): void {
    this.passwordInput.set(value);
    this.loginError.set('');
  }

  login(): void {
    if (this.passwordInput() === environment.adminPassword) {
      this.authenticated.set(true);
      this.fetchGuests();
    } else {
      this.loginError.set('Incorrect password.');
    }
  }

  fetchGuests(): void {
    this.loading.set(true);
    this.fetchError.set('');
    this.sheets.fetchGuestList().subscribe({
      next: (rows) => {
        this.guestRows.set(rows);
        this.lastRefreshed.set(new Date());
        this.loading.set(false);
      },
      error: () => {
        this.fetchError.set('Failed to load guest list. Check your Sheets API key.');
        this.loading.set(false);
      },
    });
  }

  exportToExcel(): void {
    const data = this.adminRows().map((r) => ({
      'Guest Name': r.guestName,
      'Party Of': r.partyOf,
      'Meal Choice': r.meal,
      RSVP: r.rsvp,
      'Date Submitted': r.dateSubmitted,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RSVP');
    const now = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    XLSX.writeFile(wb, `EleazMeadRSVP_${now}.xlsx`);
  }

  private formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }
}
