/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = 'd:/url-shortener/url-shortener-frontend';

const replacements = [
    { from: /border-4/g, to: 'border-2' },
    { from: /border-b-4/g, to: 'border-b-2' },
    { from: /border-r-4/g, to: 'border-r-2' },
    { from: /border-t-4/g, to: 'border-t-2' },
    { from: /shadow-\[12px_12px_0px_#1a1a1a\]/g, to: 'shadow-[6px_6px_0px_#1a1a1a]' },
    { from: /shadow-\[8px_8px_0px_#1a1a1a\]/g, to: 'shadow-[4px_4px_0px_#1a1a1a]' },
    { from: /shadow-\[8px_0_0_#1a1a1a\]/g, to: 'shadow-[4px_0_0_#1a1a1a]' },
    { from: /shadow-\[4px_4px_0px_#1a1a1a\]/g, to: 'shadow-[2px_2px_0px_#1a1a1a]' },
    { from: /shadow-\[4px_4px_0_#1a1a1a\]/g, to: 'shadow-[2px_2px_0_#1a1a1a]' },
    { from: /shadow-\[0_4px_0_#1a1a1a\]/g, to: 'shadow-[0_2px_0_#1a1a1a]' },
    { from: /drop-shadow-\[2px_2px_0_#fff\]/g, to: 'drop-shadow-[1px_1px_0_#fff]' },
    { from: /drop-shadow-\[2px_2px_0_#1a1a1a\]/g, to: 'drop-shadow-[1px_1px_0_#1a1a1a]' },
    { from: /font-black/g, to: 'font-extrabold' },
    { from: /strokeWidth=\{3\}/g, to: 'strokeWidth={2.5}' },
    { from: /strokeWidth=\{2\.5\}/g, to: 'strokeWidth={2}' },
    { from: /px-8 py-4/g, to: 'px-6 py-3' },
    { from: /px-6 py-4/g, to: 'px-4 py-2' },
    { from: /text-6xl/g, to: 'text-5xl' },
    { from: /text-5xl/g, to: 'text-4xl' },
    { from: /text-4xl/g, to: 'text-3xl' },
    { from: /h-20/g, to: 'h-16' }, // header height
    { from: /h-16/g, to: 'h-14' }, // mobile header height
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                processDirectory(fullPath);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            for (const { from, to } of replacements) {
                content = content.replace(from, to);
            }
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(FRONTEND_DIR);
