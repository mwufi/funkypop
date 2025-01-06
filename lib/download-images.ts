// download-images.ts
import { mkdir, access, writeFile } from "node:fs/promises";

const baseUrl = "https://reelfarm-ugc.s3.us-west-1.amazonaws.com";
const imageDir = "./data/images";

async function checkAndCreateDir(dir) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir);
    console.log(`Created directory: ${dir}`);
  }
}

async function downloadImage(num) {
  const url = `${baseUrl}/${num}.png`;
  const filename = `${imageDir}/${num}.png`;
  
  try {
    // First check if image exists
    const checkResponse = await fetch(url, { method: 'HEAD' });
    if (!checkResponse.ok) return false;

    // Download the image
    const response = await fetch(url);
    if (!response.ok) return false;
    
    const arrayBuffer = await response.arrayBuffer();
    await writeFile(filename, Buffer.from(arrayBuffer));
    console.log(`Successfully downloaded ${num}.png`);
    return true;

  } catch (error) {
    console.error(`Error checking/downloading image ${num}:`, error.message);
    return false;
  }
}

async function findAvailableImages(start = 1, maxAttempts = 100) {
  console.log("Checking for available images...");
  const foundImages = [];
  
  await checkAndCreateDir(imageDir);
  
  for (let num = start; num < start + maxAttempts; num++) {
    if (await downloadImage(num)) {
      foundImages.push(num);
    } else if (foundImages.length > 0 && num > Math.max(...foundImages) + 2) {
      // Break after 3 consecutive misses
      break;
    }
  }
  
  return foundImages;
}

async function main() {
  const foundImages = await findAvailableImages();
  console.log("Found images:", foundImages);
}

main().catch(console.error);
