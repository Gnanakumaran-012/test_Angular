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
import { ProductComponent } from '../../components/product-component/product.component';
import { Product, ProductService, ProductFilters } from '../../services/product.service';
import { Category, CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-page',
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
    ProductComponent
  ],
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  totalProducts = 0;
  currentPage = 0;
  pageSize = 12;
  
  filterForm: FormGroup;
  selectedFilters: ProductFilters = {};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      categoryId: [''],
      condition: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    
    // Listen to route query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterForm.patchValue({ categoryId: params['category'] });
      }
      if (params['seller']) {
        this.selectedFilters.sellerId = params['seller'];
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.selectedFilters).subscribe({
      next: (products) => {
        this.products = products;
        this.totalProducts = products.length;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load products');
        this.loading = false;
      }
    });
  }

  onFilterSubmit(): void {
    const formValue = this.filterForm.value;
    this.selectedFilters = {
      searchTerm: formValue.searchTerm || undefined,
      categoryId: formValue.categoryId || undefined,
      condition: formValue.condition || undefined,
      minPrice: formValue.minPrice || undefined,
      maxPrice: formValue.maxPrice || undefined
    };
    
    this.currentPage = 0;
    this.loadProducts();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.selectedFilters = {};
    this.currentPage = 0;
    this.loadProducts();
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

  getConditionOptions(): any[] {
    return [
      { value: '', label: 'All Conditions' },
      { value: 'new', label: 'New' },
      { value: 'used', label: 'Used' },
      { value: 'refurbished', label: 'Refurbished' }
    ];
  }

  getFilteredProducts(): Product[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.products.slice(startIndex, endIndex);
  }
}