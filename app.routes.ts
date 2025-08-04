import { Routes } from '@angular/router';
import { HomePageComponent } from './src/app/pages/home-page/home-page.component';
import { LoginPageComponent } from './src/app/pages/login-page/login-page.component';
import { AuctionPageComponent } from './src/app/pages/auction-page/auction-page.component';
import { CategoryPageComponent } from './src/app/pages/category-page/category-page.component';
import { ProductPageComponent } from './src/app/pages/product-page/product-page.component';
import { SellerPageComponent } from './src/app/pages/seller-page/seller-page.component';
import { UserDashboardPageComponent } from './src/app/pages/userdashboard-page/userdashboard-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'auctions', component: AuctionPageComponent },
  { path: 'categories', component: CategoryPageComponent },
  { path: 'categories/:id', component: CategoryPageComponent },
  { path: 'products', component: ProductPageComponent },
  { path: 'seller', component: SellerPageComponent },
  { path: 'dashboard', component: UserDashboardPageComponent },
  { path: '**', redirectTo: '' }
];
