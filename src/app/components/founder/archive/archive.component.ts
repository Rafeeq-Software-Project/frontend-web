import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-founder-archive',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="archive-page">
        <header class="page-header">
            <h1>Archive</h1>
            <p>Your past projects and historical data.</p>
        </header>

        <div class="archive-container card">
            <div class="placeholder-content">
                <i class="fas fa-archive"></i>
                <h2>No archived projects</h2>
                <p>Projects you archive will appear here for historical reference.</p>
            </div>
        </div>
    </div>
  `,
  styles: [`
    .archive-page { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { margin-bottom: 40px; }
    .page-header h1 { font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; }
    .page-header p { color: var(--text-tertiary); font-size: 1.125rem; }
    .card { background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-base); padding: 80px 40px; text-align: center; box-shadow: var(--shadow-sm); }
    .placeholder-content i { font-size: 4rem; color: var(--text-muted); margin-bottom: 24px; opacity: 0.5; }
    .placeholder-content h2 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; }
    .placeholder-content p { color: var(--text-tertiary); font-size: 1.125rem; }

  `]
})
export class ArchiveComponent {}
