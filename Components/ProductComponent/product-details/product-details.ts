import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
     
  @Input() name!: string;
  @Input() description!: string;

}
