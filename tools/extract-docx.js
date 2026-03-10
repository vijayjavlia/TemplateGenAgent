/**
 * DOCX Extractor for Template Generation
 * 
 * Extracts text, comments, tables, and dynamic fields from Word (.docx) files.
 * Outputs structured JSON with all data needed for template file generation.
 * 
 * Automatically creates a new folder named after the document for all output.
 * 
 * Usage:
 *   node tools/extract-docx.js <path-to-docx> [output-dir]
 * 
 * Examples:
 *   node tools/extract-docx.js "CIB OFFER LETTER.docx"
 *     -> Creates folder "CIB_OFFER_LETTER/" with all extracted files
 *   node tools/extract-docx.js "CIB OFFER LETTER.docx" ./my_output
 *     -> Creates folder "my_output/" with all extracted files
 * 
 * Output files (inside auto-created folder):
 *   <docname>_extracted.json   - Full structured extraction (comments, tables, dynamic fields, paragraphs)
 *   <docname>_extracted.html   - HTML conversion of the document
 *   <docname>_extracted.txt    - Plain text extraction
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const docxPath = process.argv[2];
if (!docxPath) {
    console.error('Usage: node tools/extract-docx.js <path-to-docx> [output-dir]');
    process.exit(1);
}

const resolvedDocxPath = path.resolve(docxPath);
if (!fs.existsSync(resolvedDocxPath)) {
    console.error(`File not found: ${resolvedDocxPath}`);
    process.exit(1);
}

const docName = path.basename(resolvedDocxPath, '.docx').replace(/\s+/g, '_');
// Auto-create a folder named after the document if no output-dir specified
const outputDir = process.argv[3]
    ? path.resolve(process.argv[3])
    : path.join(path.dirname(resolvedDocxPath), docName);

async function extractComments(docxFilePath) {
    // Use PowerShell to extract docx (which is a zip) — no extra npm dependency needed
    const { execSync } = require('child_process');
    const tempDir = path.join(outputDir, '_docx_temp_' + Date.now());

    try {
        fs.mkdirSync(tempDir, { recursive: true });

        // Copy docx to zip and extract
        const zipPath = path.join(tempDir, 'doc.zip');
        fs.copyFileSync(docxFilePath, zipPath);
        execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${tempDir}' -Force"`, { stdio: 'pipe' });

        const comments = [];
        const commentsXmlPath = path.join(tempDir, 'word', 'comments.xml');

        if (fs.existsSync(commentsXmlPath)) {
            const xml = fs.readFileSync(commentsXmlPath, 'utf-8');

            // Parse comments using regex (lightweight, no xml2js dependency needed)
            const commentRegex = /<w:comment\s+[^>]*w:id="(\d+)"[^>]*>/g;
            const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
            const authorRegex = /w:author="([^"]*)"/;
            const dateRegex = /w:date="([^"]*)"/;

            // Split by comment blocks
            const commentBlocks = xml.split(/<w:comment\s+/).slice(1);

            for (const block of commentBlocks) {
                const idMatch = block.match(/w:id="(\d+)"/);
                const authMatch = block.match(authorRegex);
                const dtMatch = block.match(dateRegex);

                // Extract all text runs within this comment
                const texts = [];
                let textMatch;
                const textSearchBlock = block.split(/<\/w:comment>/)[0] || block;
                const tRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
                while ((textMatch = tRegex.exec(textSearchBlock)) !== null) {
                    texts.push(textMatch[1]);
                }

                comments.push({
                    id: idMatch ? parseInt(idMatch[1]) : null,
                    author: authMatch ? authMatch[1] : '',
                    date: dtMatch ? dtMatch[1] : '',
                    text: texts.join(' ').trim()
                });
            }
        }

        // Also extract document.xml for comment reference ranges
        const documentXmlPath = path.join(tempDir, 'word', 'document.xml');
        let commentRanges = [];

        if (fs.existsSync(documentXmlPath)) {
            const docXml = fs.readFileSync(documentXmlPath, 'utf-8');

            // Find comment range start/end pairs and the text between them
            const rangeStartRegex = /<w:commentRangeStart\s+w:id="(\d+)"[^/]*\/>/g;
            let rangeMatch;

            while ((rangeMatch = rangeStartRegex.exec(docXml)) !== null) {
                const commentId = parseInt(rangeMatch[1]);
                const startPos = rangeMatch.index + rangeMatch[0].length;

                // Find the corresponding commentRangeEnd
                const endRegex = new RegExp(`<w:commentRangeEnd\\s+w:id="${commentId}"[^/]*/>`);
                const endMatch = endRegex.exec(docXml.substring(startPos));

                if (endMatch) {
                    const rangeText = docXml.substring(startPos, startPos + endMatch.index);
                    // Extract text within the range
                    const texts = [];
                    const tRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
                    let tMatch;
                    while ((tMatch = tRegex.exec(rangeText)) !== null) {
                        texts.push(tMatch[1]);
                    }
                    commentRanges.push({
                        commentId,
                        annotatedText: texts.join('').trim()
                    });
                }
            }
        }

        // Merge comment ranges with comments
        for (const range of commentRanges) {
            const comment = comments.find(c => c.id === range.commentId);
            if (comment) {
                comment.annotatedText = range.annotatedText;
            }
        }

        return comments;
    } finally {
        // Cleanup temp directory
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}

function extractTablesFromHtml(html) {
    const tables = [];
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let tableMatch;

    while ((tableMatch = tableRegex.exec(html)) !== null) {
        const tableHtml = tableMatch[0];
        const rows = [];
        const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let rowMatch;

        while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
            const cells = [];
            const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
            let cellMatch;

            while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
                // Strip HTML tags from cell content
                const cellText = cellMatch[1].replace(/<[^>]+>/g, '').trim();
                cells.push(cellText);
            }
            rows.push(cells);
        }

        tables.push({
            index: tables.length,
            rows,
            headers: rows.length > 0 ? rows[0] : [],
            dataRows: rows.length > 1 ? rows.slice(1) : []
        });
    }
    return tables;
}

function extractDotDotFields(text) {
    // Match patterns like "word……" or "word…………" (dot-dot placeholder fields)
    const fields = [];
    const dotRegex = /([A-Za-z\s/]+?)\s*[…\.]{3,}/g;
    let match;

    while ((match = dotRegex.exec(text)) !== null) {
        const fieldHint = match[1].trim();
        if (fieldHint.length > 1 && fieldHint.length < 80) {
            fields.push({
                contextText: match[0].trim(),
                fieldHint,
                position: match.index
            });
        }
    }
    return fields;
}

async function main() {
    console.log(`\nExtracting from: ${resolvedDocxPath}`);
    console.log(`Output directory: ${outputDir}\n`);

    fs.mkdirSync(outputDir, { recursive: true });

    // 1. Extract HTML
    console.log('1. Converting to HTML...');
    const htmlResult = await mammoth.convertToHtml({ path: resolvedDocxPath });
    const html = htmlResult.value;
    const htmlOutPath = path.join(outputDir, `${docName}_extracted.html`);
    fs.writeFileSync(htmlOutPath, html, 'utf-8');
    console.log(`   Saved: ${htmlOutPath}`);

    // 2. Extract plain text
    console.log('2. Extracting plain text...');
    const textResult = await mammoth.extractRawText({ path: resolvedDocxPath });
    const text = textResult.value;
    const textOutPath = path.join(outputDir, `${docName}_extracted.txt`);
    fs.writeFileSync(textOutPath, text, 'utf-8');
    console.log(`   Saved: ${textOutPath}`);

    // 3. Extract comments (dynamic field markers)
    console.log('3. Extracting comments...');
    const comments = await extractComments(resolvedDocxPath);
    console.log(`   Found ${comments.length} comments`);

    // 4. Extract tables from HTML
    console.log('4. Extracting tables...');
    const tables = extractTablesFromHtml(html);
    console.log(`   Found ${tables.length} tables`);

    // 5. Extract dot-dot fields
    console.log('5. Extracting dot-dot (dynamic) fields...');
    const dotDotFields = extractDotDotFields(text);
    console.log(`   Found ${dotDotFields.length} dot-dot fields`);

    // 6. Build structured output
    const extraction = {
        sourceFile: path.basename(resolvedDocxPath),
        extractedAt: new Date().toISOString(),
        summary: {
            totalComments: comments.length,
            totalTables: tables.length,
            totalDotDotFields: dotDotFields.length
        },
        comments,
        tables,
        dotDotFields,
        htmlWarnings: htmlResult.messages.filter(m => m.type === 'warning').map(m => m.message)
    };

    const jsonOutPath = path.join(outputDir, `${docName}_extracted.json`);
    fs.writeFileSync(jsonOutPath, JSON.stringify(extraction, null, 2), 'utf-8');
    console.log(`\n6. Saved structured extraction: ${jsonOutPath}`);

    // 7. Print summary
    console.log('\n========== EXTRACTION SUMMARY ==========\n');

    if (comments.length > 0) {
        console.log('COMMENTS (Dynamic Fields):');
        console.log('-'.repeat(60));
        for (const c of comments) {
            const annotated = c.annotatedText ? ` [on: "${c.annotatedText}"]` : '';
            console.log(`  [${c.id}] "${c.text}"${annotated}`);
        }
        console.log();
    }

    if (tables.length > 0) {
        console.log('TABLES:');
        console.log('-'.repeat(60));
        for (const t of tables) {
            console.log(`  Table ${t.index + 1}: ${t.rows.length} rows, headers: [${t.headers.join(', ')}]`);
        }
        console.log();
    }

    if (dotDotFields.length > 0) {
        console.log('DOT-DOT FIELDS (Dynamic Placeholders):');
        console.log('-'.repeat(60));
        for (const f of dotDotFields) {
            console.log(`  "${f.fieldHint}" -> ${f.contextText.substring(0, 60)}`);
        }
        console.log();
    }

    console.log('=========================================\n');
    console.log('Extraction complete. Use the _extracted.json file for template generation.');
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
