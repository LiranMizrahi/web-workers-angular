import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GrayscaleFilterComponent } from './grayscale-filter/grayscale-filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, GrayscaleFilterComponent]
})
export class AppComponent implements OnInit {

  title = 'web-workers-angular';
  imageSrc: string | ArrayBuffer | null = null;
  selectedImage!: Blob
  ngOnInit(): void {
    const testWorker = new Worker(new URL('./test.worker.ts', import.meta.url))
    testWorker.postMessage("hello from appcomponent")
    testWorker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
  }

  onFileSelected(event: any) {
    this.selectedImage = event?.target?.files[0];
    this.displayImage();

    console.log("fileselected");

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
