// download-videos.js
import { mkdir, access, writeFile } from "node:fs/promises";

const baseUrl = "https://reelfarm-ugc.s3.us-west-1.amazonaws.com";
const videoDir = "./data/videos";

async function checkAndCreateDir(dir) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir);
    console.log(`Created directory: ${dir}`);
  }
}

async function downloadVideo(num) {
  const url = `${baseUrl}/${num}.mp4`;
  const filename = `${videoDir}/video_${num}.mp4`;
  
  try {
    // First check if video exists
    const checkResponse = await fetch(url, { method: 'HEAD' });
    if (!checkResponse.ok) return false;

    // Download the video
    const response = await fetch(url);
    if (!response.ok) return false;
    
    const arrayBuffer = await response.arrayBuffer();
    await writeFile(filename, Buffer.from(arrayBuffer));
    console.log(`Successfully downloaded video_${num}.mp4`);
    return true;

  } catch (error) {
    console.error(`Error checking/downloading video ${num}:`, error.message);
    return false;
  }
}

async function findAvailableVideos(start = 1, maxAttempts = 100) {
  console.log("Checking for available videos...");
  const foundVideos = [];
  
  await checkAndCreateDir(videoDir);
  
  for (let num = start; num < start + maxAttempts; num++) {
    if (await downloadVideo(num)) {
      foundVideos.push(num);
    } else if (foundVideos.length > 0 && num > Math.max(...foundVideos) + 2) {
      // Break after 3 consecutive misses
      break;
    }
  }
  
  return foundVideos;
}

async function main() {
  const foundVideos = await findAvailableVideos();
  
  if (foundVideos.length > 0) {
    console.log(`\nFound ${foundVideos.length} videos`);
    console.log(`Video numbers found: ${foundVideos}`);
  } else {
    console.log("No videos were found or accessible");
  }
}

main().catch(console.error);