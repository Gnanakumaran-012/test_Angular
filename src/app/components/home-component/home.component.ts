import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuctionComponent } from '../auction-component/auction.component';
import { CategoryComponent } from '../category-component/category.component';
import { Auction, AuctionService } from '../../services/auction.service';
import { Category, CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    AuctionComponent,
    CategoryComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredAuctions: Auction[] = [];
  endingSoonAuctions: Auction[] = [];
  popularCategories: Category[] = [];
  loading = true;

  constructor(
    private auctionService: AuctionService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData(): void {
    this.loading = true;
    
    // Load featured auctions
    this.auctionService.getFeaturedAuctions().subscribe(auctions => {
      this.featuredAuctions = auctions;
    });

    // Load ending soon auctions
    this.auctionService.getEndingSoonAuctions().subscribe(auctions => {
      this.endingSoonAuctions = auctions;
    });

    // Load popular categories
    this.categoryService.getPopularCategories().subscribe(categories => {
      this.popularCategories = categories;
      this.loading = false;
    });
  }

  onBidPlaced(auctionId: number): void {
    this.router.navigate(['/auctions', auctionId]);
  }

  onWatchToggled(auctionId: number): void {
    // Refresh the auction data
    this.loadHomeData();
  }

  onCategorySelected(category: Category): void {
    this.router.navigate(['/categories', category.id]);
  }

  viewAllAuctions(): void {
    this.router.navigate(['/auctions']);
  }

  viewAllCategories(): void {
    this.router.navigate(['/categories']);
  }

  getStarted(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/auctions']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}