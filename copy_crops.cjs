const fs = require('fs');
const path = require('path');

const srcDir = fs.readdirSync(__dirname).find(d => d.includes('المنتجات'));
const fullSrc = path.join(__dirname, srcDir || 'المنتجات الفلاحية');
const destDir = path.join(__dirname, 'public', 'images', 'crops');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  const files = fs.readdirSync(fullSrc);

  const mappings = [
    { p: /apricots-/, n: 'apricot.jpg' },
    { p: /banana-/, n: 'banana.jpg' },
    { p: /cherries-/, n: 'cherry.jpg' },
    { p: /eggplant-/, n: 'eggplant.jpg' },
    { p: /kiwi-/, n: 'kiwi.jpg' },
    { p: /oranges-/, n: 'citrus.jpg' },
    { p: /peach-2632182_/, n: 'peach.jpg' },
    { p: /raspberries-1465988/, n: 'raspberry.jpg' },
    { p: /strawberry-/, n: 'strawberry.jpg' },
    { p: /FENOUIL/, n: 'fennel.jpg' }
  ];

  let count = 0;
  files.forEach(file => {
    for (const map of mappings) {
      if (map.p.test(file)) {
        fs.copyFileSync(path.join(fullSrc, file), path.join(destDir, map.n));
        console.log(`Copied ${file} -> public/images/crops/${map.n}`);
        count++;
      }
    }
  });

  console.log(`All done! Successfully placed ${count} high-quality images.`);
} catch (e) {
  console.error("Failed to read directory or copy files:", e.message);
}
