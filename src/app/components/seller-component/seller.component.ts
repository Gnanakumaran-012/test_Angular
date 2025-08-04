import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

export interface SellerStats {
  totalAuctions: number;
  activeAuctions: number;
  totalSales: number;
  totalProducts: number;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent {
  @Input() seller!: User;
  @Input() stats?: SellerStats;
  @Input() showActions: boolean = true;
  @Output() sellerSelected = new EventEmitter<User>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSellerClick(): void {
    this.sellerSelected.emit(this.seller);
    this.router.navigate(['/seller', this.seller.id]);
  }

  onViewAuctions(): void {
    this.router.navigate(['/auctions'], { 
      queryParams: { seller: this.seller.id } 
    });
  }

  onViewProducts(): void {
    this.router.navigate(['/products'], { 
      queryParams: { seller: this.seller.id } 
    });
  }

  onContactSeller(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/messages'], { 
      queryParams: { recipient: this.seller.id } 
    });
  }

  getRatingStars(): number[] {
    const rating = this.stats?.rating || 0;
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  getRatingColor(): string {
    const rating = this.stats?.rating || 0;
    if (rating >= 4.5) return 'accent';
    if (rating >= 4.0) return 'primary';
    if (rating >= 3.0) return 'warn';
    return 'default';
  }

  isCurrentUser(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.seller.id;
  }
}