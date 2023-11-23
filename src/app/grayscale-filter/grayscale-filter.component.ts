import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-grayscale-filter',
  standalone: true,
  template: `
    <input type="file" (change)="handleImage($event)" accept="image/*">
    <canvas style="height: 300px;" #canvas></canvas>`,
  styles: []
})
export class GrayscaleFilterComponent {

  @ViewChild('canvas', { static: true }) canvasRef: ElementRef | undefined;

  constructor() { }

  handleImage(event: any): void {
    const canvas: HTMLCanvasElement = this.canvasRef?.nativeElement;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (ctx === null) return
    //const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    const file = event.target.files[0];

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      //  this.grayscaleFilter(ctx, canvas.width, canvas.height);
      this.blurFilter(ctx, canvas.width, canvas.height, 15)
    };

    img.src = URL.createObjectURL(file);
  }

  grayscaleFilter(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const grayscale = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = grayscale;
    }

    ctx.putImageData(imageData, 0, 0);
  }
  blurFilter(ctx: CanvasRenderingContext2D, width: number, height: number, radius: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);

    const side = 2 * radius + 1;
    const divisor = side * side;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let redTotal = 0;
        let greenTotal = 0;
        let blueTotal = 0;

        for (let offsetY = -radius; offsetY <= radius; offsetY++) {
          for (let offsetX = -radius; offsetX <= radius; offsetX++) {
            const currentX = x + offsetX;
            const currentY = y + offsetY;

            const dataIndex = (currentY * width + currentX) * 4;

            if (currentX >= 0 && currentX < width && currentY >= 0 && currentY < height) {
              redTotal += copy[dataIndex];
              greenTotal += copy[dataIndex + 1];
              blueTotal += copy[dataIndex + 2];
            }
          }
        }

        const dataIndex = (y * width + x) * 4;

        data[dataIndex] = redTotal / divisor;
        data[dataIndex + 1] = greenTotal / divisor;
        data[dataIndex + 2] = blueTotal / divisor;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }


}

