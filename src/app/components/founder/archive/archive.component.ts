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
    .page-header h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
    :host-context(.dark-mode) .page-header h1 { color: #f8fafc; }
    .page-header p { color: #64748b; font-size: 1.125rem; }
    .card { background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; padding: 80px 40px; text-align: center; }
    :host-context(.dark-mode) .card { background: #1e293b; border-color: #334155; }
    .placeholder-content i { font-size: 4rem; color: #cbd5e1; margin-bottom: 24px; }
    :host-context(.dark-mode) .placeholder-content i { color: #475569; }
    .placeholder-content h2 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
    :host-context(.dark-mode) .placeholder-content h2 { color: #f8fafc; }
    .placeholder-content p { color: #64748b; font-size: 1.125rem; }
  `]
})
export class ArchiveComponent {}
