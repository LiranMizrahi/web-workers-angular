import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatInputModule} from '@angular/material/input'
import {MatButtonModule} from '@angular/material/button'
import {NavComponent} from "./nav/nav.component";
import {blurFilter, blurFilter1, grayscaleFilter} from './utils';

import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, MatInputModule, NavComponent, MatButtonModule, FormsModule]
})
export class AppComponent implements OnInit {

  startTime:number = 0
  // constructor
  grayFilterWorker!: Worker;
  blurFilterWorker!: Worker;
  title = 'web-workers-angular';
  imageSrc: string | ArrayBuffer | null = null;
  selectedImage!: Blob
  filteredImage = false;
  @ViewChild('canvas') canvasRef: ElementRef | undefined;
  private img: HTMLImageElement  = new Image();


  ngOnInit(): void {
    this.grayFilterWorker = new Worker(new URL('./gray-filter.worker', import.meta.url))
    this.grayFilterWorker.onmessage = (( data ) => {
        console.log("DATA FROM RESPONSE")
        this.filteredImage = true
        const canvas: HTMLCanvasElement = this.canvasRef?.nativeElement;
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d', {willReadFrequently: true});
        if (ctx === null) return
        ctx.putImageData(data.data, 0, 0)
        const endTime = new Date().getTime();
        console.log(endTime);
        console.log(endTime - this.startTime);
      }
    )
    this.blurFilterWorker = new Worker(new URL('./blur-filter.worker', import.meta.url))
    this.blurFilterWorker.onmessage = (( data ) => {
      console.log("DATA FROM RESPONSE")
      this.filteredImage = true
      const canvas: HTMLCanvasElement = this.canvasRef?.nativeElement;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d',{ willReadFrequently: true });
      if (ctx === null) return
      ctx.putImageData(data.data,0,0)
      const endTime = new Date().getTime();
      console.log(endTime);
      console.log(endTime - this.startTime);
    })

  }

  onGrayFilter() {
    this.handleImage(grayscaleFilter)
  }
  onBlurFilter() {
    this.handleImage(blurFilter)
  }

  handleImage(filterFunction: Function): void {
    this.startTime = new Date().getTime()
    console.log(this.startTime)
    const canvas: HTMLCanvasElement = this.canvasRef?.nativeElement;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d',{ willReadFrequently: true });
    if (ctx === null) return
    const img = new Image();
   img.onload = () => {
     canvas.width = img.width;
     canvas.height = img.height;
     ctx.drawImage(img, 0, 0);
      // grayscaleFilter(ctx, canvas.width, canvas.height);
      filterFunction(ctx,canvas.width,canvas.height)
      const endTime = new Date().getTime();
     console.log(endTime)
     console.log(endTime - this.startTime)
   };
    img.src = URL.createObjectURL(this.selectedImage);
    this.filteredImage = true

  }

  handleImageWorker(): void {
    this.startTime = new Date().getTime()
    console.log(this.startTime)
    this.filteredImage = true
    const canvas: HTMLCanvasElement = this.canvasRef?.nativeElement;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d',{ willReadFrequently: true });
    if (ctx === null) return
    this.img.onload = () => {
      console.log("ONLODE")
      canvas.width = this.img.width ;
      canvas.height = this.img.height ;
      ctx.drawImage(this.img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.grayFilterWorker.postMessage( data)
    };

    this.img.src = URL.createObjectURL(this.selectedImage);
  }

  handleImageWorkerBlur(): void {
    this.startTime = new Date().getTime()
    console.log(this.startTime)
    this.filteredImage = true
    const canvas: HTMLCanvasElement = this.canvasRef?.nativeElement;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d',{ willReadFrequently: true });
    if (ctx === null) return
    this.img.onload = () => {
      console.log("ONLODE")
      canvas.width = this.img.width ;
      canvas.height = this.img.height ;
      ctx.drawImage(this.img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.blurFilterWorker.postMessage({imageData:data,height:canvas.height,width:canvas.width});
    };

    this.img.src = URL.createObjectURL(this.selectedImage);
  }
  onFileSelected(event: any) {
    this.selectedImage = event?.target?.files[0];
    this.displayImage();

  }

  displayImage(): void {
    if (this.selectedImage) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageSrc = fileReader.result ?? "";
      };
      fileReader.readAsDataURL(this.selectedImage);
    }

  }

}



