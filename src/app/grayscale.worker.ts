/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  //const imageData = event.data;

  // Apply grayscale filter
  const grayImageData = grayscaleFilter(data);

  postMessage(grayImageData);
});

function grayscaleFilter(imageData: ImageData): ImageData {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Calculate grayscale value
    const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;

    // Set red, green, and blue channels to the grayscale value
    data[i] = grayscale;
    data[i + 1] = grayscale;
    data[i + 2] = grayscale;
  }

  return imageData;
}
