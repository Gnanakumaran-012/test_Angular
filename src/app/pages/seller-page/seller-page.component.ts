import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuctionComponent } from '../../components/auction-component/auction.component';
import { ProductComponent } from '../../components/product-component/product.component';
import { Auction, AuctionService } from '../../services/auction.service';
import { Product, ProductService } from '../../services/product.service';
import { AuthService, User } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

export interface SellerStats {
  totalAuctions: number;
  activeAuctions: number;
  totalSales: number;
  totalProducts: number;
  totalRevenue: number;
  averageRating: number;
}

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    AuctionComponent,
    ProductComponent
  ],
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css']
})
export class SellerPageComponent implements OnInit {
  currentUser: User | null = null;
  stats: SellerStats = {
    totalAuctions: 0,
    activeAuctions: 0,
    totalSales: 0,
    totalProducts: 0,
    totalRevenue: 0,
    averageRating: 0
  };
  
  myAuctions: Auction[] = [];
  myProducts: Product[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 10;

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

    if (!this.authService.isSeller()) {
      this.notificationService.showError('Access denied. Seller privileges required.');
      this.router.navigate(['/']);
      return;
    }
    
    this.loadSellerData();
  }

  loadSellerData(): void {
    this.loading = true;
    
    // Load seller auctions
    this.auctionService.getMyAuctions().subscribe(auctions => {
      this.myAuctions = auctions;
      this.stats.totalAuctions = auctions.length;
      this.stats.activeAuctions = auctions.filter(a => a.status === 'active').length;
    });

    // Load seller products
    this.productService.getMyProducts().subscribe(products => {
      this.myProducts = products;
      this.stats.totalProducts = products.length;
    });

    // Mock stats data (replace with actual API calls)
    this.stats = {
      totalAuctions: 15,
      activeAuctions: 8,
      totalSales: 45,
      totalProducts: 23,
      totalRevenue: 12500,
      averageRating: 4.7
    };

    this.loading = false;
  }

  onCreateAuction(): void {
    this.router.navigate(['/seller/create-auction']);
  }

  onCreateProduct(): void {
    this.router.navigate(['/seller/create-product']);
  }

  onViewAnalytics(): void {
    this.router.navigate(['/seller/analytics']);
  }

  onManageInventory(): void {
    this.router.navigate(['/seller/inventory']);
  }

  onViewOrders(): void {
    this.router.navigate(['/seller/orders']);
  }

  onBidPlaced(auctionId: number): void {
    this.router.navigate(['/auctions', auctionId]);
  }

  onWatchToggled(auctionId: number): void {
    this.loadSellerData();
  }

  onProductSelected(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  onAddToCart(product: Product): void {
    this.notificationService.showSuccess('Product added to cart!');
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getFilteredAuctions(): Auction[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.myAuctions.slice(startIndex, endIndex);
  }

  getFilteredProducts(): Product[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.myProducts.slice(startIndex, endIndex);
  }
}