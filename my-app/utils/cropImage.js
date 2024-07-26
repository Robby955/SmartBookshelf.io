// utils/cropImage.js
export function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  canvas.width = maxSize;
  canvas.height = maxSize;

  ctx.translate(maxSize / 2, maxSize / 2);
  ctx.translate(-maxSize / 2, -maxSize / 2);

  ctx.drawImage(
    image,
    0,
    0
  );

  const data = ctx.getImageData(0, 0, maxSize, maxSize);

  // set canvas size to final crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the final size
  ctx.putImageData(
    data,
    Math.round(0 - maxSize / 2 + pixelCrop.x),
    Math.round(0 - maxSize / 2 + pixelCrop.y)
  );

  // As Base64 string
  return canvas.toDataURL('image/jpeg');

  // As a blob
  // return new Promise((resolve) => {
  //   canvas.toBlob((file) => {
  //     resolve(URL.createObjectURL(file));
  //   }, 'image/jpeg');
  // });
}
