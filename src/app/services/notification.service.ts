import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  relatedEntityType?: 'auction' | 'bid' | 'product' | 'system';
  relatedEntityId?: number;
}

export interface CreateNotificationRequest {
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  relatedEntityType?: 'auction' | 'bid' | 'product' | 'system';
  relatedEntityId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = 'http://localhost:8080/api/notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.loadUnreadCount();
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.API_URL);
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/unread`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/mark-all-read`, {});
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  createNotification(notificationData: CreateNotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(this.API_URL, notificationData);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/unread-count`);
  }

  private loadUnreadCount(): void {
    this.getUnreadCount().subscribe(count => {
      this.unreadCountSubject.next(count);
    });
  }

  // Toast notifications
  showSuccess(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  showError(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  showWarning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }

  showInfo(message: string, title?: string): void {
    this.toastr.info(message, title);
  }

  // Real-time notifications (for WebSocket integration)
  sendBidNotification(auctionId: number, bidAmount: number): void {
    this.showInfo(`New bid of $${bidAmount} placed on auction #${auctionId}`, 'New Bid');
  }

  sendAuctionEndingNotification(auctionId: number, minutesLeft: number): void {
    this.showWarning(`Auction #${auctionId} ends in ${minutesLeft} minutes!`, 'Auction Ending Soon');
  }

  sendOutbidNotification(auctionId: number): void {
    this.showError(`You have been outbid on auction #${auctionId}`, 'Outbid');
  }

  sendAuctionWonNotification(auctionId: number): void {
    this.showSuccess(`Congratulations! You won auction #${auctionId}`, 'Auction Won');
  }
}