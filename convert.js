const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');
content = content.replace(/<!--(.*?)-->/g, '{/* $1 */}');
fs.writeFileSync('frontend/src/routes/index.tsx', content);
