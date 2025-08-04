import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { AuctionComponent } from '../auction-component/auction.component';
import { ProductComponent } from '../product-component/product.component';
import { Auction, AuctionService } from '../../services/auction.service';
import { Product, ProductService } from '../../services/product.service';
import { AuthService, User } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

export interface DashboardStats {
  totalBids: number;
  wonAuctions: number;
  activeBids: number;
  totalSpent: number;
  watchlistCount: number;
  favoriteSellers: number;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    AuctionComponent,
    ProductComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: DashboardStats = {
    totalBids: 0,
    wonAuctions: 0,
    activeBids: 0,
    totalSpent: 0,
    watchlistCount: 0,
    favoriteSellers: 0
  };
  
  watchedAuctions: Auction[] = [];
  recentBids: Auction[] = [];
  recommendedProducts: Product[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private auctionService: AuctionService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load watched auctions
    this.auctionService.getWatchedAuctions().subscribe(auctions => {
      this.watchedAuctions = auctions;
      this.stats.watchlistCount = auctions.length;
    });

    // Load recommended products
    this.productService.getFeaturedProducts().subscribe(products => {
      this.recommendedProducts = products.slice(0, 6);
    });

    // Mock data for stats (replace with actual API calls)
    this.stats = {
      totalBids: 24,
      wonAuctions: 8,
      activeBids: 5,
      totalSpent: 1250,
      watchlistCount: this.watchedAuctions.length,
      favoriteSellers: 3
    };

    this.loading = false;
  }

  onBidPlaced(auctionId: number): void {
    this.router.navigate(['/auctions', auctionId]);
  }

  onWatchToggled(auctionId: number): void {
    this.loadDashboardData();
  }

  onProductSelected(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  onAddToCart(product: Product): void {
    this.notificationService.showSuccess('Product added to cart!');
  }

  viewAllWatched(): void {
    this.router.navigate(['/auctions'], { queryParams: { watched: true } });
  }

  viewAllBids(): void {
    this.router.navigate(['/bids']);
  }

  viewAllProducts(): void {
    this.router.navigate(['/products']);
  }

  getBidSuccessRate(): number {
    if (this.stats.totalBids === 0) return 0;
    return (this.stats.wonAuctions / this.stats.totalBids) * 100;
  }

  getAverageBidAmount(): number {
    if (this.stats.totalBids === 0) return 0;
    return this.stats.totalSpent / this.stats.totalBids;
  }
}