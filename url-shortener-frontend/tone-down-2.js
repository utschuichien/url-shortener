/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = 'd:/url-shortener/url-shortener-frontend';

const replacements = [
    { from: /shadow-\[6px_6px_0px_#1a1a1a\]/g, to: 'shadow-[3px_3px_0px_#1a1a1a]' },
    { from: /shadow-\[4px_4px_0px_#1a1a1a\]/g, to: 'shadow-[2px_2px_0px_#1a1a1a]' },
    { from: /shadow-\[4px_0_0_#1a1a1a\]/g, to: 'shadow-[2px_0_0_#1a1a1a]' },
    { from: /shadow-\[2px_2px_0px_#1a1a1a\]/g, to: 'shadow-[1px_1px_0px_#1a1a1a]' },
    { from: /shadow-\[2px_2px_0_#1a1a1a\]/g, to: 'shadow-[1px_1px_0_#1a1a1a]' },
    { from: /hover:-translate-y-1/g, to: 'hover:-translate-y-0.5' },
    { from: /hover:translate-x-1/g, to: 'hover:translate-x-0.5' },
    { from: /font-extrabold/g, to: 'font-bold' },
    { from: /font-bold/g, to: 'font-semibold' },
    { from: /text-5xl/g, to: 'text-4xl' },
    { from: /text-4xl/g, to: 'text-3xl' },
    { from: /text-3xl/g, to: 'text-2xl' },
    { from: /text-2xl/g, to: 'text-xl' },
    { from: /px-6 py-3/g, to: 'px-4 py-2' },
    { from: /p-8/g, to: 'p-6' },
    { from: /p-6/g, to: 'p-4' },
    { from: /h-16/g, to: 'h-14' },
    { from: /h-14/g, to: 'h-12' },
    { from: /className="p-2 bg-white/g, to: 'className="cursor-pointer p-2 bg-white' },
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
