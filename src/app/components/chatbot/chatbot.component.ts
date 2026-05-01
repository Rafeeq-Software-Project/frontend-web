import { Component, Inject, PLATFORM_ID, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({
        text: 'مرحباً! أنا رفيق، كيف يمكنني مساعدتك اليوم؟',
        sender: 'bot',
        timestamp: new Date()
      });
    }
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userText = this.userInput.trim();
    this.messages.push({
      text: userText,
      sender: 'user',
      timestamp: new Date()
    });
    this.userInput = '';
    this.isLoading = true;

    this.http.post<any>(environment.chatbotApiUrl, { input: userText })
      .subscribe({
        next: (response) => {
          this.messages.push({
            text: response.output || 'عذراً، حدث خطأ ما.',
            sender: 'bot',
            timestamp: new Date()
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Chatbot API error:', err);
          this.messages.push({
            text: 'عذراً، واجهت مشكلة في الاتصال بالخادم.',
            sender: 'bot',
            timestamp: new Date()
          });
          this.isLoading = false;
        }
      });
  }

  private scrollToBottom(): void {
    if (isPlatformBrowser(this.platformId) && this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }
}
