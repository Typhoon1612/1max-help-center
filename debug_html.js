import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const SOURCE_DIR = 'c:\\Users\\wingk\\Downloads\\7d4ac3c2-215c-48c0-9d18-992c11782a92_ExportBlock-87d902db-604c-4a8e-bc2d-a034c749dcf5\\ExportBlock-87d902db-604c-4a8e-bc2d-a034c749dcf5-Part-1\\Help Center';

// Find the Account & Security file
try {
    const files = fs.readdirSync(SOURCE_DIR);
    const target = files.find(f => f.startsWith('Anti Money Laundering') && f.endsWith('.html'));
    
    if (target) {
        const filePath = path.join(SOURCE_DIR, target);
        console.log(`Analyzing: ${target}`);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        
        console.log('Title:', doc.title);
        console.log('Body Text Snippet:');
        console.log(doc.body.textContent.replace(/\s+/g, ' ').substring(0, 500));
        
        console.log('\n--- DOM Structure Overview ---');
        // Print usage of common tags
        ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'figure', 'details', 'summary', 'table'].forEach(tag => {
            const count = doc.querySelectorAll(tag).length;
            console.log(`${tag}: ${count}`);
        });

        console.log('\n--- First H2 Analysis ---');
        const h2 = doc.querySelector('h2');
        if (h2) {
            console.log('H2 Text:', h2.textContent);
            console.log('Parent Tag:', h2.parentElement.tagName);
            console.log('Parent Class:', h2.parentElement.className);
            console.log('Next Sibling of H2:', h2.nextElementSibling ? h2.nextElementSibling.tagName : 'None');
            console.log('Next Sibling of H2 Parent:', h2.parentElement.nextElementSibling ? h2.parentElement.nextElementSibling.tagName : 'None');
            
            // Print the next sibling of parent content
            if (h2.parentElement.nextElementSibling) {
                console.log('Content of Next Sibling of Parent:', h2.parentElement.nextElementSibling.textContent.substring(0, 100).replace(/\n/g, ' '));
            }
        }
        
    } else {
        console.log('Target file not found');
    }
} catch (e) {
    console.error(e);
}
