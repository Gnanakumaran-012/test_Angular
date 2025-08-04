import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isSeller(): boolean {
    return this.hasRole('seller') || this.hasRole('admin');
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_URL}/refresh`, {});
  }
}