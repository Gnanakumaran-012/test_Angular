import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuctionComponent } from '../../components/auction-component/auction.component';
import { Auction, AuctionService, AuctionFilters } from '../../services/auction.service';
import { Category, CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-auction-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    AuctionComponent
  ],
  templateUrl: './auction-page.component.html',
  styleUrls: ['./auction-page.component.css']
})
export class AuctionPageComponent implements OnInit {
  auctions: Auction[] = [];
  categories: Category[] = [];
  loading = true;
  totalAuctions = 0;
  currentPage = 0;
  pageSize = 12;
  
  filterForm: FormGroup;
  selectedFilters: AuctionFilters = {};

  constructor(
    private auctionService: AuctionService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      categoryId: [''],
      status: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAuctions();
    
    // Listen to route query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterForm.patchValue({ categoryId: params['category'] });
      }
      if (params['seller']) {
        this.selectedFilters.sellerId = params['seller'];
      }
      if (params['watched']) {
        this.loadWatchedAuctions();
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadAuctions(): void {
    this.loading = true;
    this.auctionService.getAuctions(this.selectedFilters).subscribe({
      next: (auctions) => {
        this.auctions = auctions;
        this.totalAuctions = auctions.length;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load auctions');
        this.loading = false;
      }
    });
  }

  loadWatchedAuctions(): void {
    this.loading = true;
    this.auctionService.getWatchedAuctions().subscribe({
      next: (auctions) => {
        this.auctions = auctions;
        this.totalAuctions = auctions.length;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load watched auctions');
        this.loading = false;
      }
    });
  }

  onFilterSubmit(): void {
    const formValue = this.filterForm.value;
    this.selectedFilters = {
      searchTerm: formValue.searchTerm || undefined,
      categoryId: formValue.categoryId || undefined,
      status: formValue.status || undefined,
      minPrice: formValue.minPrice || undefined,
      maxPrice: formValue.maxPrice || undefined
    };
    
    this.currentPage = 0;
    this.loadAuctions();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.selectedFilters = {};
    this.currentPage = 0;
    this.loadAuctions();
  }

  onBidPlaced(auctionId: number): void {
    this.router.navigate(['/auctions', auctionId]);
  }

  onWatchToggled(auctionId: number): void {
    // Refresh the auction data
    this.loadAuctions();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    // In a real app, you would pass pagination params to the API
  }

  getStatusOptions(): any[] {
    return [
      { value: '', label: 'All Status' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'active', label: 'Active' },
      { value: 'ended', label: 'Ended' }
    ];
  }

  getFilteredAuctions(): Auction[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.auctions.slice(startIndex, endIndex);
  }
}