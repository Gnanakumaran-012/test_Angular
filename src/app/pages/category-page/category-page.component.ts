import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CategoryComponent } from '../../components/category-component/category.component';
import { Category, CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    CategoryComponent
  ],
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {
  categories: Category[] = [];
  mainCategories: Category[] = [];
  loading = true;
  totalCategories = 0;
  currentPage = 0;
  pageSize = 12;
  
  searchForm: FormGroup;
  selectedCategoryId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    // Listen to route params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.selectedCategoryId = +params['id'];
        this.loadSubcategories(this.selectedCategoryId);
      }
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getMainCategories().subscribe({
      next: (categories) => {
        this.mainCategories = categories;
        this.categories = categories;
        this.totalCategories = categories.length;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load categories');
        this.loading = false;
      }
    });
  }

  loadSubcategories(parentId: number): void {
    this.loading = true;
    this.categoryService.getSubcategories(parentId).subscribe({
      next: (subcategories) => {
        this.categories = subcategories;
        this.totalCategories = subcategories.length;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load subcategories');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) {
      // Filter categories based on search term
      this.categories = this.mainCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.totalCategories = this.categories.length;
    } else {
      this.categories = this.mainCategories;
      this.totalCategories = this.categories.length;
    }
    this.currentPage = 0;
  }

  onCategorySelected(category: Category): void {
    this.router.navigate(['/categories', category.id]);
  }

  onViewAuctions(category: Category): void {
    this.router.navigate(['/auctions'], { 
      queryParams: { category: category.id } 
    });
  }

  onViewProducts(category: Category): void {
    this.router.navigate(['/products'], { 
      queryParams: { category: category.id } 
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getFilteredCategories(): Category[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.categories.slice(startIndex, endIndex);
  }

  goBackToMainCategories(): void {
    this.selectedCategoryId = null;
    this.categories = this.mainCategories;
    this.totalCategories = this.mainCategories.length;
    this.router.navigate(['/categories']);
  }
}