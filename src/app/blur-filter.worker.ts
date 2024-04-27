/// <reference lib="webworker" />

import {blurFilter1} from "./utils";

addEventListener('message', ({ data }) => {
  console.log(data)
  const imageDate = blurFilter1(data.imageData,data.width,data.height)
  postMessage(imageDate);
});
