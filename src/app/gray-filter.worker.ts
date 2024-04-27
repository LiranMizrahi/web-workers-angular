/// <reference lib="webworker" />

import { grayscaleFilter1 } from "./utils";

addEventListener('message', ({ data }) => {
  const imageDate = grayscaleFilter1(data)
  postMessage(imageDate);
});
