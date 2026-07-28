const fs = require('fs');
const path = require('path');

const BACKEND_DIR = 'd:/url-shortener/url-shortener-backend/src';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Regex to find import statements ending with .js
            // e.g. import { Something } from './something.js';
            // e.g. import * as something from '../something.js';
            // We want to replace .js' or .js" with ' or "
            content = content.replace(/from\s+(['"])(.*?)\.js(['"])/g, "from $1$2$3");
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(BACKEND_DIR);
console.log('Done stripping .js extensions from imports.');
