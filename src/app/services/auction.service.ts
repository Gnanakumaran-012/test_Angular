import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Auction {
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  reservePrice?: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  sellerId: number;
  sellerName: string;
  categoryId: number;
  categoryName: string;
  images: string[];
  bids: Bid[];
  totalBids: number;
  isWatched?: boolean;
}

export interface Bid {
  id: number;
  auctionId: number;
  bidderId: number;
  bidderName: string;
  amount: number;
  timestamp: string;
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  startingPrice: number;
  reservePrice?: number;
  startDate: string;
  endDate: string;
  categoryId: number;
  images?: string[];
}

export interface PlaceBidRequest {
  auctionId: number;
  amount: number;
}

export interface AuctionFilters {
  categoryId?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sellerId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private readonly API_URL = 'http://localhost:8080/api/auctions';

  constructor(private http: HttpClient) {}

  getAuctions(filters?: AuctionFilters): Observable<Auction[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.searchTerm) params = params.set('search', filters.searchTerm);
      if (filters.sellerId) params = params.set('sellerId', filters.sellerId.toString());
    }

    return this.http.get<Auction[]>(this.API_URL, { params });
  }

  getAuctionById(id: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.API_URL}/${id}`);
  }

  createAuction(auctionData: CreateAuctionRequest): Observable<Auction> {
    return this.http.post<Auction>(this.API_URL, auctionData);
  }

  updateAuction(id: number, auctionData: Partial<CreateAuctionRequest>): Observable<Auction> {
    return this.http.put<Auction>(`${this.API_URL}/${id}`, auctionData);
  }

  deleteAuction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  placeBid(bidData: PlaceBidRequest): Observable<Bid> {
    return this.http.post<Bid>(`${this.API_URL}/${bidData.auctionId}/bids`, bidData);
  }

  getBids(auctionId: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.API_URL}/${auctionId}/bids`);
  }

  getMyAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.API_URL}/my-auctions`);
  }

  getWatchedAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.API_URL}/watched`);
  }

  watchAuction(auctionId: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${auctionId}/watch`, {});
  }

  unwatchAuction(auctionId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${auctionId}/watch`);
  }

  getFeaturedAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.API_URL}/featured`);
  }

  getEndingSoonAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.API_URL}/ending-soon`);
  }

  getPopularAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.API_URL}/popular`);
  }
}