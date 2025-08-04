import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() product!: Product;
  @Input() showActions: boolean = true;
  @Output() productSelected = new EventEmitter<Product>();
  @Output() addToCart = new EventEmitter<Product>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onProductClick(): void {
    this.productSelected.emit(this.product);
    this.router.navigate(['/products', this.product.id]);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.addToCart.emit(this.product);
  }

  getConditionColor(): string {
    switch (this.product.condition) {
      case 'new': return 'accent';
      case 'used': return 'primary';
      case 'refurbished': return 'warn';
      default: return 'default';
    }
  }

  getConditionText(): string {
    return this.product.condition.charAt(0).toUpperCase() + this.product.condition.slice(1);
  }

  isInStock(): boolean {
    return this.product.stockQuantity > 0 && this.product.isActive;
  }

  getStockStatus(): string {
    if (!this.product.isActive) return 'Inactive';
    if (this.product.stockQuantity === 0) return 'Out of Stock';
    if (this.product.stockQuantity <= 5) return 'Low Stock';
    return 'In Stock';
  }

  getStockColor(): string {
    if (!this.product.isActive) return 'warn';
    if (this.product.stockQuantity === 0) return 'warn';
    if (this.product.stockQuantity <= 5) return 'accent';
    return 'primary';
  }
}