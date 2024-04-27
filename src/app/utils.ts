export function grayscaleFilter(ctx: CanvasRenderingContext2D, width: number, height: number) {
  console.log("Start Filter")
    const imageData = ctx.getImageData(0, 0, width, height);
  console.log(imageData);

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const grayscale = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = grayscale;
    }
    // return imageData
  console.log("render from grayscaleFilter",imageData);

  ctx.putImageData(imageData, 0, 0);
}

export function grayscaleFilter1(imageData: ImageData): ImageData {

  console.log(imageData)
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Calculate grayscale value
    const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;

    // Set red, green, and blue channels to the grayscale value
    data[i] = grayscale;
    data[i + 1] = grayscale;
    data[i + 2] = grayscale;
  }
  console.log(imageData);
  console.log("ENd Filter")

  return imageData;
}



export function blurFilter(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);
    let radius = 10;
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

export function blurFilter1(imageData: ImageData, width: number, height: number): ImageData {
  // const imageData = ctx.getImageData(0, 0, width, height);
   const data = imageData.data;
  const copy = new Uint8ClampedArray(imageData.data);
  let radius = 10;
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
 return imageData;
}
