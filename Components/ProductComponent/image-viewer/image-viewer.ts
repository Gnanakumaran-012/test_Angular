import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  imports: [],
  templateUrl: './image-viewer.html',
  styleUrl: './image-viewer.css',
  standalone: true
})
export class ImageViewer {
  @Input() imageUrl!: string;
}



