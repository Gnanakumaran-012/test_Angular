import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  sellerId: number;
  sellerName: string;
  images: string[];
  condition: 'new' | 'used' | 'refurbished';
  brand?: string;
  model?: string;
  specifications?: Record<string, any>;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  images?: string[];
  condition: 'new' | 'used' | 'refurbished';
  brand?: string;
  model?: string;
  specifications?: Record<string, any>;
  stockQuantity: number;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  brand?: string;
  searchTerm?: string;
  sellerId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.condition) params = params.set('condition', filters.condition);
      if (filters.brand) params = params.set('brand', filters.brand);
      if (filters.searchTerm) params = params.set('search', filters.searchTerm);
      if (filters.sellerId) params = params.set('sellerId', filters.sellerId.toString());
    }

    return this.http.get<Product[]>(this.API_URL, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  createProduct(productData: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.API_URL, productData);
  }

  updateProduct(id: number, productData: Partial<CreateProductRequest>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/my-products`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/featured`);
  }

  getNewArrivals(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/new-arrivals`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/category/${categoryId}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/search`, {
      params: { q: query }
    });
  }

  updateStock(id: number, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${id}/stock`, { quantity });
  }

  toggleProductStatus(id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${id}/toggle-status`, {});
  }
}