const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (f !== 'node_modules' && f !== '.next' && fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      callback(path.join(dirPath));
    }
  });
}

let modifiedFiles = 0;

walkDir('./src', function(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    // Replace leftover emerald-\d00 plain colors
    .replace(/bg-emerald-[346]00/g, 'bg-primary')
    .replace(/text-emerald-[346]00/g, 'text-primary')
    .replace(/border-emerald-[346]00/g, 'border-primary')
    // Replace solid primary background with gradient where appropriate
    .replace(/bg-primary(?!\/)(?=\s)/g, 'bg-premium-gradient')
    .replace(/bg-primary(?=[\s"])/g, 'bg-premium-gradient') // For end of class names
    // Fix instances where text-primary should be a text-gradient if it's large text, but usually text-primary is fine. 
    // The user specifically complained about the support page using solid green for the header and button.
    .replace(/bg-premium-gradient\/\d+/g, 'bg-primary/20'); // prevent bg-premium-gradient/90 

    // We shouldn't replace text-primary with text-gradient globally as icons break, but bg-primary is safe to be gradient!

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    modifiedFiles++;
    console.log('Modified', filePath);
  }
});

console.log(`Replaced all solid primary backgrounds with premium gradients in ${modifiedFiles} files.`);
