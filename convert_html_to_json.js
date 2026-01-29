import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = 'c:\\Users\\wingk\\Downloads\\7d4ac3c2-215c-48c0-9d18-992c11782a92_ExportBlock-87d902db-604c-4a8e-bc2d-a034c749dcf5\\ExportBlock-87d902db-604c-4a8e-bc2d-a034c749dcf5-Part-1\\Help Center';
const OUTPUT_DIR = path.join(__dirname, 'faq_data_master', 'json-files');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Mapping from source file prefix to output filename and category name
const FILE_MAPPING = [
    { prefix: 'Account & Security', output: 'account_security.json', category: 'Account & Security' },
    { prefix: 'Deposit & Withdrawal', output: 'deposit_withdrawal.json', category: 'Deposit & Withdrawal' },
    { prefix: 'Task Center', output: 'task_center.json', category: 'Task Center' },
    { prefix: 'Spot', output: 'spot_trading.json', category: 'Spot Trading' },
    { prefix: 'Futures', output: 'futures_trading.json', category: 'Futures Trading' },
    { prefix: 'Staking', output: 'staking.json', category: 'Staking' },
    // Add others if found
    { prefix: 'Spot Copy Trading', output: 'spot_copy_trading.json', category: 'Spot Copy Trading' },
    { prefix: 'Futures Copy Trading', output: 'futures_copy_trading.json', category: 'Futures Copy Trading' },
    { prefix: 'Grid Trading', output: 'grid_trading.json', category: 'Grid Trading' },
    { prefix: 'Margin', output: 'margin.json', category: 'Margin' },
    { prefix: 'FIAT2CRYPTO', output: 'fiat_crypto.json', category: 'FIAT2CRYPTO' },
    { prefix: 'Anti Money Laundering', output: 'aml.json', category: 'Anti Money Laundering' },
    { prefix: 'Download App', output: 'download_app.json', category: 'Download App' },
    { prefix: 'All cryptocurrency', output: 'all_cryptocurrency.json', category: 'All Cryptocurrency' },
    { prefix: 'Promotion and program', output: 'promotion_program.json', category: 'Promotion and Program' },
];

/**
 * Clean text content
 */
function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/&nbsp;/g, ' ')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Generate ID from question
 */
function generateId(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .replace(/^-|-$/g, '') // Remove start/end hyphens
        .substring(0, 50);
}

/**
 * Parse a block element
 */
function parseBlock(element) {
    const tagName = element.tagName.toLowerCase();

    // Text (Paragraph)
    if (tagName === 'p') {
        const text = cleanText(element.textContent);
        if (text) return { type: 'text', value: text };
    }

    // List
    if (tagName === 'ul' || tagName === 'ol') {
        const items = Array.from(element.querySelectorAll('li'))
            .map(li => cleanText(li.textContent))
            .filter(t => t);
        if (items.length > 0) return { type: 'list', value: items };
    }

    // Image
    if (tagName === 'img' || tagName === 'figure') {
        const img = tagName === 'img' ? element : element.querySelector('img');
        if (img) {
            let src = img.getAttribute('src');
            if (src) {
                // Determine if it's a URL or a local path
                if (src.startsWith('http')) {
                    // It's a remote URL
                    return { type: 'image', value: src };
                } else {
                    // It's a local file, decode parsing
                    try {
                        src = decodeURIComponent(src);
                        const filename = path.basename(src);
                        return { type: 'image', value: `images/${filename}` };
                    } catch (e) {
                        return { type: 'image', value: `images/${path.basename(src)}` };
                    }
                }
            }
        }
    }
    
    // Handle nested toggle content which might be inside a div or just listed
    // If we encounter a div, we might want to dive into it? 
    // For now, simplify to flat structure.

    return null;
}

/**
 * Process a single HTML file
 */
function processFile(filePath, mapping) {
    console.log(`\nProcessing: ${path.basename(filePath)}`);
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const faqs = [];
    let currentFaq = null;
    let faqCounter = 0;

    // Strategy: Iterate over the children of .page-body
    const pageBody = doc.querySelector('.page-body');
    
    if (!pageBody) {
        console.warn(`  ⚠️ No .page-body found in ${filePath}`);
        return;
    }

    const blocks = Array.from(pageBody.children);

    for (const blockWrapper of blocks) {
        // 1. Check for Headings (New Question)
        // Check for H1, H2, H3, Summary inside the block wrapper
        const h1 = blockWrapper.querySelector('h1');
        const h2 = blockWrapper.querySelector('h2');
        const h3 = blockWrapper.querySelector('h3');
        const summary = blockWrapper.querySelector('summary');
        
        // Extended detection for questions formatted as plain text with numbers (e.g., "1. Question")
        // Notion Sometimes exports as <p><strong>1. Question</strong></p> or just <p>1. Question</p>
        let pHeading = null;
        const p = blockWrapper.querySelector('p');
        if (p) {
            const text = cleanText(p.textContent);
            // Check if text starts with "Number." and has distinct length, or is significantly bolded
            if (/^\d+\./.test(text) && text.length < 150) {
                 pHeading = p;
            }
        }
        
        // Treat H1 inside .page-body as a section/question (unlike the page title which is in header)
        if (h1 || h2 || h3 || summary || pHeading) {
            const headingEl = h1 || h2 || h3 || summary || pHeading;
            const question = cleanText(headingEl.textContent);
            
            if (question && question.toLowerCase() !== 'table of contents') {
                const id = generateId(question) || `faq-${faqCounter++}`;
                
                currentFaq = {
                    id,
                    question,
                    blocks: []
                };
                faqs.push(currentFaq);
            }
            continue; // Move to next block, assuming header block only contains header
        }

        // 2. Add Content to Current Question
        if (currentFaq) {
            // Extract meaningful content from the wrapper
            // The wrapper might contain p, ul, ol, figure, etc.
            
            // We search for specific content tags inside the wrapper
            const contentNodes = blockWrapper.querySelectorAll('p, ul, ol, figure, img');
            
            contentNodes.forEach(node => {
                // Ignore empty nodes or nodes that are inside other processed nodes (e.g. img inside figure)
                // But querySelectorAll returns flatted list. 
                // Creating a simplified block extraction.
                
                // Avoid duplicating if we have nested structures (like img inside figure)
                if (node.tagName.toLowerCase() === 'img' && node.closest('figure')) {
                    return;
                }
                
                const parsed = parseBlock(node);
                if (parsed) {
                    currentFaq.blocks.push(parsed);
                }
            });
            
            // Special handling for text directly in div? (Rare in Notion export, usually wrapped in p)
        }
    }

    if (faqs.length === 0) {
        console.warn(`  ⚠️ No FAQs found in ${mapping.output}`);
        return;
    }

    const outputData = {
        category: mapping.category,
        faqs
    };

    const outPath = path.join(OUTPUT_DIR, mapping.output);
    fs.writeFileSync(outPath, JSON.stringify(outputData, null, 2));
    console.log(`  ✅ Created ${mapping.output} with ${faqs.length} FAQs`);
}

/**
 * Main execution
 */
function run() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR);

    // Iterate through mappings and find matching files
    FILE_MAPPING.forEach(mapping => {
        // Find a file that starts with the prefix (ignoring case)
        const match = files.find(f => 
            f.toLowerCase().startsWith(mapping.prefix.toLowerCase()) && 
            f.endsWith('.html') &&
            // Avoid matching "Spot Copy Trading" when looking for "Spot"
            (mapping.prefix.length > 10 || f.substring(mapping.prefix.length).match(/^(\s|%20)+[a-f0-9]+|^\.html/i))
        );

        if (match) {
            processFile(path.join(SOURCE_DIR, match), mapping);
        } else {
            // If file not found in root, check if there is a folder with that name
            // Sometimes Notion exports index.html outside and pages inside text name folders
            // But the user said "from [Filename].html"
            console.warn(`  ⚠️ Could not find source file for prefix: "${mapping.prefix}"`);
            
            // Try to find if there's a folder with that name and look inside? (Optional advanced behavior)
            const folderMatch = files.find(f => f.toLowerCase().startsWith(mapping.prefix.toLowerCase()) && !f.endsWith('.html'));
             if (folderMatch) {
                 const folderPath = path.join(SOURCE_DIR, folderMatch);
                 if(fs.statSync(folderPath).isDirectory()) {
                     console.log(`      (Found folder "${folderMatch}", checking inside...)`);
                     // Deep search inside folder?? 
                     // Usually the folder contains image assets or sub-pages.
                     // If the main html is empty or missing, maybe it's inside.
                     // Let's list files in there just to see.
                     try {
                        const subFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.html'));
                        if (subFiles.length > 0) {
                             console.log(`      Found ${subFiles.length} HTML files inside ${folderMatch}. You might need to process these manually or update logic.`);
                        }
                     } catch (e) {}
                 }
             }
        }
    });
}

run();
