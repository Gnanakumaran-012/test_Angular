import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Category } from '../../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  @Input() category!: Category;
  @Input() showActions: boolean = true;
  @Output() categorySelected = new EventEmitter<Category>();

  constructor(private router: Router) {}

  onCategoryClick(): void {
    this.categorySelected.emit(this.category);
    this.router.navigate(['/categories', this.category.id]);
  }

  onViewAuctions(): void {
    this.router.navigate(['/auctions'], { 
      queryParams: { category: this.category.id } 
    });
  }

  onViewProducts(): void {
    this.router.navigate(['/products'], { 
      queryParams: { category: this.category.id } 
    });
  }
}