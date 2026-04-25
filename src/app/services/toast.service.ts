import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toasts = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toasts.asObservable();

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
        const id = Math.random().toString(36).substring(2, 9);
        const currentToasts = this.toasts.getValue();
        this.toasts.next([...currentToasts, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => this.dismiss(id), 3000);
    }

    success(message: string) {
        this.show(message, 'success');
    }

    error(message: string) {
        this.show(message, 'error');
    }

    info(message: string) {
        this.show(message, 'info');
    }

    warning(message: string) {
        this.show(message, 'warning');
    }

    dismiss(id: string) {
        const currentToasts = this.toasts.getValue();
        this.toasts.next(currentToasts.filter(t => t.id !== id));
    }
}
