import fs from 'fs';
import path from 'path';
import https from 'https';

const components = [
  "StoryAboutMe.astro",
  "StoryFamily.astro",
  "StoryFriends.astro",
  "StoryHobbies.astro",
  "StoryCooking.astro",
  "StoryPhotos.astro",
  "StoryFinalGallery.astro"
];

const basePath = '/Users/jeenu/WorkSpace/SandboxForBrains/Astro/src/components';
const assetsPath = '/Users/jeenu/WorkSpace/SandboxForBrains/Astro/src/assets';

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      } else {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', (err) => reject(err));
      }
    }).on('error', (err) => reject(err));
  });
};

const extractUrls = (content) => {
  const regex = /<img[^>]+src="([^"]+)"/g;
  const urls = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
      if (match[1].startsWith('http')) {
        urls.push(match[1]);
      }
  }
  return urls;
};

async function main() {
  for (const component of components) {
    const compName = component.replace('.astro', '');
    const compPath = path.join(basePath, component);
    const folderPath = path.join(assetsPath, compName);
    
    if (fs.existsSync(compPath)) {
      const content = fs.readFileSync(compPath, 'utf8');
      const urls = extractUrls(content);
      
      console.log(`Found ${urls.length} images in ${component}`);
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const filename = `image_${i + 1}.jpg`; // Unsplash are mostly jpgs
        const outPath = path.join(folderPath, filename);
        if (!fs.existsSync(outPath)) {
          console.log(`Downloading ${url} to ${outPath}`);
          await downloadImage(url, outPath);
        }
      }
    }
  }
}

main().catch(console.error);
