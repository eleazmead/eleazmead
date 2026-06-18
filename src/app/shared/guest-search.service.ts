import { Injectable, inject } from '@angular/core';
import { Observable, of, tap, map } from 'rxjs';
import { SheetsService } from './sheets.service';
import { GuestRow } from './models/guest.model';

@Injectable({ providedIn: 'root' })
export class GuestSearchService {
  private sheets = inject(SheetsService);
  private guestList: GuestRow[] = [];
  private loaded = false;

  loadGuests(): Observable<void> {
    if (this.loaded) return of(undefined);
    return this.sheets.fetchGuestList().pipe(
      tap((rows) => {
        this.guestList = rows;
        this.loaded = true;
      }),
      map(() => undefined),
    );
  }

  findMatch(query: string): { row: GuestRow; matchedName: string } | null {
    if (!query.trim()) return null;
    let best: GuestRow | null = null;
    let bestMatchedName = '';
    let bestScore = 0;

    for (const row of this.guestList) {
      const candidates = [row.fullName, row.guest1Name, row.guest2Name].filter(Boolean);
      for (const candidate of candidates) {
        const score = this.fuzzyScore(query, candidate);
        if (score >= 0.5 && score > bestScore) {
          bestScore = score;
          best = row;
          bestMatchedName = candidate;
        }
      }
    }
    return best ? { row: best, matchedName: bestMatchedName } : null;
  }

  getRelatedNames(row: GuestRow): string[] {
    return [row.guest1Name, row.guest2Name].filter((n) => n.trim().length > 0);
  }

  private fuzzyScore(query: string, target: string): number {
    const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ');
    const queryTokens = normalize(query).split(' ');
    const targetTokens = normalize(target).split(' ');

    const matched = queryTokens.filter((qt) =>
      targetTokens.some((tt) => tt === qt),
    ).length;

    return matched / Math.max(queryTokens.length, targetTokens.length);
  }
}
