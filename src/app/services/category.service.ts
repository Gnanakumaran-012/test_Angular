import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: number;
  subcategories?: Category[];
  auctionCount?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/${id}`);
  }

  getMainCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/main`);
  }

  getSubcategories(parentId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/${parentId}/subcategories`);
  }

  createCategory(categoryData: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.API_URL, categoryData);
  }

  updateCategory(id: number, categoryData: Partial<CreateCategoryRequest>): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getPopularCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/popular`);
  }
}