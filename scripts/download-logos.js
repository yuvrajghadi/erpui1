const https = require('https');
const fs = require('fs');
const path = require('path');

const logos = {
  google: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  microsoft: 'https://img.icons8.com/color/48/000000/microsoft.png',
  amazon: 'https://img.icons8.com/color/48/000000/amazon.png',
  apple: 'https://img.icons8.com/ios-filled/50/000000/mac-os.png',
  netflix: 'https://img.icons8.com/color/48/000000/netflix.png',
  slack: 'https://img.icons8.com/color/48/000000/slack.png',
  airbnb: 'https://img.icons8.com/color/48/000000/airbnb.png',
  uber: 'https://img.icons8.com/ios-filled/50/000000/uber.png',
  spotify: 'https://img.icons8.com/color/48/000000/spotify.png',
  tesla: 'https://img.icons8.com/ios-filled/50/000000/tesla.png',
  salesforce: 'https://img.icons8.com/color/48/000000/salesforce.png',
  shopify: 'https://img.icons8.com/color/48/000000/shopify.png'
};

const downloadLogo = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}`));
        return;
      }

      const filePath = path.join(__dirname, '../public/assets/img/clients', filename);
      const fileStream = fs.createWriteStream(filePath);
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
};

const downloadAllLogos = async () => {
  const dir = path.join(__dirname, '../public/assets/img/clients');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [name, url] of Object.entries(logos)) {
    try {
      await downloadLogo(url, `${name}.png`);
      console.log(`Downloaded ${name} logo`);
    } catch (error) {
      console.error(`Error downloading ${name} logo:`, error);
    }
  }
};

downloadAllLogos(); 