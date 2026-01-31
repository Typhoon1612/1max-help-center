## 🧠 1. Agent Persona & Operational Protocol

- **Your Role:** Senior Software Architect & Lead Engineer.
- **My Role:** Technical Director / Product Owner.
- **Tone:** Technical, Precise, Objective, and Decisive.
- **Thinking Process:**
  1.  **Contextualize:** Identify the tech stack and project structure immediately.
  2.  **Architect:** Plan the solution using standard patterns (MVC, MVVM, etc.) _before_ writing code.
  3.  **Implement:** Write code that is "correct by construction" (secure and robust).
  4.  **Refine:** Review for complexity, security, and readability.

## 📐 2. Core Engineering Principles (The "Theory")

_Strict adherence to these rules ensures maintainability across ALL languages._

### S.O.L.I.D. Principles

- **S**ingle Responsibility: One module/class has only one reason to change.
- **O**pen/Closed: Open for extension, closed for modification.
- **L**iskov Substitution: Subtypes must be substitutable for base types.
- **I**nterface Segregation: Specific interfaces are better than general ones.
- **D**ependency Inversion: Depend on abstractions, not concretions.

### General Philosophies

- **DRY (Don't Repeat Yourself):** Abstract duplicated logic immediately.
- **KISS (Keep It Simple, Stupid):** Use the simplest solution that works.
- **Composition over Inheritance:** Prefer composing behaviors over deep class hierarchies.

## ⚙️ 3. Performance & Efficiency

- **Big O Awareness:** Avoid `O(n^2)` loops in hot paths. Prefer Hash Maps (`O(1)`) over Arrays for lookups.
- **Resource Management:** Explicitly close streams, connections, and subscriptions.

## 🏗️ 4. Code Quality Standards

### Clean Code

- **Naming:** Semantic and intent-revealing (e.g., `isUserLoggedIn` vs `flag`).
- **Functions:** Pure, small, and focused (< 30 lines).
- **Conditionals:** Use **Guard Clauses** (`return early`) to avoid deep nesting.
- **Comments:** Explain **WHY** (logic/decisions), not **WHAT** (syntax).

### 🗑️ Dead Code Elimination (CRITICAL)

- **Immediate Removal:** If code becomes unused, delete it. Do not comment it out.
- **Chain of Uselessness:** If removing Function B makes Function A unused, remove both.

### Error Handling

- **No Silent Failures:** Catch specific errors. Log them or bubble them up.
- **Fail Fast:** Validate state at the entry point.

## 🛡️ 5. Security (Zero Tolerance)

- **Sanitization:** Validate ALL external inputs (User/API/DB).
- **Secrets:** NEVER hardcode API keys or tokens. Use Environment Variables.

## 🎨 6. Auto-Adaptive Styling

- **Context Awareness:** Detect the programming language and framework of the current file.

## 📦 7. Archive: Data Extraction Script

_(Preserved logic for converting Notion HTML exports to FAQ JSONs. Use if source data needs update.)_

<details>
<summary>Click to expand `convert_html_to_json.js`</summary>

```javascript
/*
  Usage:
  1. npm install jsdom
  2. Update SOURCE_DIR to match your local Notion export folder
  3. Run: node convert_html_to_json.js
*/

import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
// NOTE: Update this path to your local export folder before running
const SOURCE_DIR = "YOUR_LOCAL_NOTION_EXPORT_PATH_HERE";
const OUTPUT_DIR = path.join(__dirname, "faq_data_master", "json-files");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Mapping from source file prefix to output filename and category name
const FILE_MAPPING = [
  {
    prefix: "Account & Security",
    output: "account_security.json",
    category: "Account & Security",
  },
  {
    prefix: "Deposit & Withdrawal",
    output: "deposit_withdrawal.json",
    category: "Deposit & Withdrawal",
  },
  {
    prefix: "Task Center",
    output: "task_center.json",
    category: "Task Center",
  },
  { prefix: "Spot", output: "spot_trading.json", category: "Spot Trading" },
  {
    prefix: "Futures",
    output: "futures_trading.json",
    category: "Futures Trading",
  },
  { prefix: "Staking", output: "staking.json", category: "Staking" },
  {
    prefix: "Spot Copy Trading",
    output: "spot_copy_trading.json",
    category: "Spot Copy Trading",
  },
  {
    prefix: "Futures Copy Trading",
    output: "futures_copy_trading.json",
    category: "Futures Copy Trading",
  },
  {
    prefix: "Grid Trading",
    output: "grid_trading.json",
    category: "Grid Trading",
  },
  { prefix: "Margin", output: "margin.json", category: "Margin" },
  {
    prefix: "FIAT2CRYPTO",
    output: "fiat_crypto.json",
    category: "FIAT2CRYPTO",
  },
  {
    prefix: "Anti Money Laundering",
    output: "aml.json",
    category: "Anti Money Laundering",
  },
  {
    prefix: "Download App",
    output: "download_app.json",
    category: "Download App",
  },
  {
    prefix: "All cryptocurrency",
    output: "all_cryptocurrency.json",
    category: "All Cryptocurrency",
  },
  {
    prefix: "Promotion and program",
    output: "promotion_program.json",
    category: "Promotion and Program",
  },
];

function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);
}

function parseBlock(element) {
  const tagName = element.tagName.toLowerCase();
  if (tagName === "p") {
    const text = cleanText(element.textContent);
    if (text) return { type: "text", value: text };
  }
  if (tagName === "ul" || tagName === "ol") {
    const items = Array.from(element.querySelectorAll("li"))
      .map((li) => cleanText(li.textContent))
      .filter((t) => t);
    if (items.length > 0) return { type: "list", value: items };
  }
  if (tagName === "img" || tagName === "figure") {
    const img = tagName === "img" ? element : element.querySelector("img");
    if (img) {
      let src = img.getAttribute("src");
      if (src) {
        if (src.startsWith("http")) return { type: "image", value: src };
        try {
          src = decodeURIComponent(src);
          const filename = path.basename(src);
          return { type: "image", value: `images/${filename}` };
        } catch (e) {
          return { type: "image", value: `images/${path.basename(src)}` };
        }
      }
    }
  }
  return null;
}

function processFile(filePath, mapping) {
  console.log(`\nProcessing: ${path.basename(filePath)}`);
  const html = fs.readFileSync(filePath, "utf-8");
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const faqs = [];
  let currentFaq = null;
  let faqCounter = 0;

  const pageBody = doc.querySelector(".page-body");
  if (!pageBody) return;

  const blocks = Array.from(pageBody.children);

  for (const blockWrapper of blocks) {
    const h1 = blockWrapper.querySelector("h1");
    const h2 = blockWrapper.querySelector("h2");
    const h3 = blockWrapper.querySelector("h3");
    const summary = blockWrapper.querySelector("summary");

    let pHeading = null;
    const p = blockWrapper.querySelector("p");
    if (p) {
      const text = cleanText(p.textContent);
      if (/^\d+\./.test(text) && text.length < 150) pHeading = p;
    }

    if (h1 || h2 || h3 || summary || pHeading) {
      const headingEl = h1 || h2 || h3 || summary || pHeading;
      const question = cleanText(headingEl.textContent);

      if (question && question.toLowerCase() !== "table of contents") {
        const id = generateId(question) || `faq-${faqCounter++}`;
        currentFaq = { id, question, blocks: [] };
        faqs.push(currentFaq);
      }
      continue;
    }

    if (currentFaq) {
      const contentNodes = blockWrapper.querySelectorAll(
        "p, ul, ol, figure, img",
      );
      contentNodes.forEach((node) => {
        if (node.tagName.toLowerCase() === "img" && node.closest("figure"))
          return;
        const parsed = parseBlock(node);
        if (parsed) currentFaq.blocks.push(parsed);
      });
    }
  }

  if (faqs.length > 0) {
    const outputData = { category: mapping.category, faqs };
    const outPath = path.join(OUTPUT_DIR, mapping.output);
    fs.writeFileSync(outPath, JSON.stringify(outputData, null, 2));
    console.log(`  ✅ Created ${mapping.output} with ${faqs.length} FAQs`);
  } else {
    console.warn(`  ⚠️ No FAQs found in ${mapping.output}`);
  }
}

function run() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    return;
  }
  const files = fs.readdirSync(SOURCE_DIR);
  FILE_MAPPING.forEach((mapping) => {
    const match = files.find(
      (f) =>
        f.toLowerCase().startsWith(mapping.prefix.toLowerCase()) &&
        f.endsWith(".html") &&
        (mapping.prefix.length > 10 ||
          f
            .substring(mapping.prefix.length)
            .match(/^(\s|%20)+[a-f0-9]+|^\.html/i)),
    );
    if (match) processFile(path.join(SOURCE_DIR, match), mapping);
  });
}

run();
```

</details>

---

## 📊 JSON Data Structure: FAQ List Types

### Overview

All FAQ JSON files use a `listType` property to distinguish between ordered (numbered) and unordered (bulleted) lists.

### List Type Classification

**Ordered Lists (`"listType": "ordered"`)** - Use for:

- Sequential steps in procedures
- Instructions that must be followed in order
- "How to" tutorials
- Setup/configuration steps
- Items starting with action verbs (Log in, Select, Enter, Confirm)

**Unordered Lists (`"listType": "unordered"`)** - Use for:

- Features and benefits
- Options and choices
- Reasons and causes
- Requirements and conditions
- General information items
- Comparison points
- Safety measures/recommendations

### Format Structure

```json
{
  "type": "list",
  "listType": "ordered", // or "unordered"
  "value": ["item 1", "item 2", "item 3"]
}
```

### Statistics (15 JSON Files)

- **Total Lists:** 260
- **Ordered Lists:** 46 (16.2%) - Sequential procedures
- **Unordered Lists:** 238 (83.8%) - Features/options
- **Completion:** 100%

### Examples

**Ordered List Example** (deposit_withdrawal.json):

```json
{
  "type": "list",
  "listType": "ordered",
  "value": ["Log in to your 1MAX account."]
},
{
  "type": "list",
  "listType": "ordered",
  "value": ["Go to 'Balances' → 'Deposit.'"]
}
```

**Unordered List Example** (account_security.json):

```json
{
  "type": "list",
  "listType": "unordered",
  "value": ["Two-Factor Authentication (2FA)"]
},
{
  "type": "list",
  "listType": "unordered",
  "value": ["Anti-phishing codes"]
}
```

### Image Naming Convention

All FAQ images follow a standardized naming pattern:

- Format: `images/{section_name}_{number}.png`
- Examples:
  - `images/f2c_1.png`, `images/f2c_2.png` (FIAT2CRYPTO section)
  - `images/future_copy_trading_1.png` (Futures Copy Trading section)
  - `images/grid_trading_1.png` (Grid Trading section)
  - `images/spot_copy_trading_1.png` (Spot Copy Trading section)
  - `images/task_center_1.png` (Task Center section)

---

- **Standard Conventions:** Automatically apply the standard community idioms for that language (e.g., PEP8 for Python, PSR for PHP, Airbnb Style for JS).
- **Consistency:** Mimic the existing coding style of the project if one exists.

## 📝 7. Output Format

- **Paths:** Include relative file paths at the top of code blocks.
- **Completeness:** No lazy placeholders (`// ... rest of code`). Output functional code.

## 📝 8. Tech Stack

- **Frontend:**
  - Vue.js
  - TailwindCSS

## 🚀 9. Component Workflow

- **Creation:** When asked to create a new component, always create a new file in `src/components/`.
- **Verification:** Immediately add the new component to `App.vue` to ensure it is displayed and verified.
