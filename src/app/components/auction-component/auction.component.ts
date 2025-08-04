import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Auction, AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {
  @Input() auction!: Auction;
  @Input() showActions: boolean = true;
  @Output() bidPlaced = new EventEmitter<number>();
  @Output() watchToggled = new EventEmitter<number>();

  timeLeft: string = '';
  isWatching: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private auctionService: AuctionService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.isWatching = this.auction.isWatched || false;
    this.updateTimeLeft();
    setInterval(() => this.updateTimeLeft(), 1000);
  }

  updateTimeLeft(): void {
    const now = new Date().getTime();
    const endTime = new Date(this.auction.endDate).getTime();
    const timeDiff = endTime - now;

    if (timeDiff <= 0) {
      this.timeLeft = 'Ended';
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    if (days > 0) {
      this.timeLeft = `${days}d ${hours}h`;
    } else if (hours > 0) {
      this.timeLeft = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      this.timeLeft = `${minutes}m ${seconds}s`;
    } else {
      this.timeLeft = `${seconds}s`;
    }
  }

  getStatusColor(): string {
    switch (this.auction.status) {
      case 'active': return 'accent';
      case 'upcoming': return 'primary';
      case 'ended': return 'warn';
      default: return 'default';
    }
  }

  getStatusText(): string {
    return this.auction.status.charAt(0).toUpperCase() + this.auction.status.slice(1);
  }

  onBidClick(): void {
    if (!this.isAuthenticated) {
      this.notificationService.showError('Please login to place a bid');
      this.router.navigate(['/login']);
      return;
    }

    if (this.auction.status !== 'active') {
      this.notificationService.showWarning('This auction is not active');
      return;
    }

    this.bidPlaced.emit(this.auction.id);
  }

  onWatchClick(): void {
    if (!this.isAuthenticated) {
      this.notificationService.showError('Please login to watch auctions');
      this.router.navigate(['/login']);
      return;
    }

    if (this.isWatching) {
      this.auctionService.unwatchAuction(this.auction.id).subscribe(() => {
        this.isWatching = false;
        this.notificationService.showInfo('Removed from watchlist');
        this.watchToggled.emit(this.auction.id);
      });
    } else {
      this.auctionService.watchAuction(this.auction.id).subscribe(() => {
        this.isWatching = true;
        this.notificationService.showSuccess('Added to watchlist');
        this.watchToggled.emit(this.auction.id);
      });
    }
  }

  onViewDetails(): void {
    this.router.navigate(['/auctions', this.auction.id]);
  }

  getProgressPercentage(): number {
    if (this.auction.reservePrice) {
      return Math.min((this.auction.currentPrice / this.auction.reservePrice) * 100, 100);
    }
    return 0;
  }
}