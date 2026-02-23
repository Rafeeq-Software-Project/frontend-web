import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

interface User {
  id: number;
  name: string;
  avatar: string; // URL or class for avatar
  status: 'online' | 'offline' | 'busy';
}

interface Conversation {
  id: number;
  user: User;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  currentUser: User = {
    id: 0,
    name: 'Me',
    avatar: 'assets/avatars/me.png', // Placeholder
    status: 'online'
  };

  conversations: Conversation[] = [
    {
      id: 1,
      user: { id: 1, name: 'Sarah Connor', avatar: 'network-avatar-1', status: 'online' },
      lastMessage: 'Hey, I saw your pitch deck. It looks promising!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      unreadCount: 2,
      messages: [
        { id: 1, senderId: 1, text: 'Hi Alex!', timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
        { id: 2, senderId: 0, text: 'Hi Sarah, thanks for reaching out.', timestamp: new Date(Date.now() - 1000 * 60 * 55), isMe: true },
        { id: 3, senderId: 1, text: 'I have some questions about your roadmap.', timestamp: new Date(Date.now() - 1000 * 60 * 10), isMe: false },
        { id: 4, senderId: 1, text: 'Hey, I saw your pitch deck. It looks promising!', timestamp: new Date(Date.now() - 1000 * 60 * 5), isMe: false },
      ]
    },
    {
      id: 2,
      user: { id: 2, name: 'Michael Chen', avatar: 'network-avatar-2', status: 'offline' },
      lastMessage: 'Let\'s schedule a call for next Tuesday.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 0,
      messages: [
        { id: 1, senderId: 2, text: 'Are you available next week?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), isMe: false },
        { id: 2, senderId: 0, text: 'Yes, Tuesday works for me.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), isMe: true },
        { id: 3, senderId: 2, text: 'Let\'s schedule a call for next Tuesday.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isMe: false },
      ]
    },
    {
      id: 3,
      user: { id: 3, name: 'Jessica Pearson', avatar: '', status: 'busy' },
      lastMessage: 'Thanks for the update.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      unreadCount: 0,
      messages: [
        { id: 1, senderId: 0, text: 'Just sent over the quarterly report.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49), isMe: true },
        { id: 2, senderId: 3, text: 'Thanks for the update.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isMe: false },
      ]
    }
  ];

  selectedConversation: Conversation | null = null;
  newMessageText: string = '';
  isMobileChatOpen: boolean = false;

  constructor() {
    // On desktop (> 768px), select the first conversation by default
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      this.selectedConversation = this.conversations[0];
    }
  }

  selectConversation(conversation: Conversation) {
    if (this.selectedConversation === conversation) {
      this.isMobileChatOpen = true; // Still open it if already selected on mobile
      return;
    }

    this.selectedConversation = null;
    this.isMobileChatOpen = true;

    // Small delay to allow Angular to destroy the previous component/template block
    setTimeout(() => {
      this.selectedConversation = conversation;
      if (this.selectedConversation) {
        this.selectedConversation.unreadCount = 0; // Mark as read
      }
    }, 10);
  }

  closeChat() {
    this.isMobileChatOpen = false;
  }

  sendMessage() {
    if (!this.newMessageText.trim() || !this.selectedConversation) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: this.currentUser.id,
      text: this.newMessageText,
      timestamp: new Date(),
      isMe: true
    };

    this.selectedConversation.messages.push(newMessage);
    this.selectedConversation.lastMessage = this.newMessageText;
    this.selectedConversation.lastMessageTime = new Date();

    // Move conversation to top
    const index = this.conversations.findIndex(c => c.id === this.selectedConversation?.id);
    if (index > 0) {
      this.conversations.splice(index, 1);
      this.conversations.unshift(this.selectedConversation);
    }

    this.newMessageText = '';
  }
}
