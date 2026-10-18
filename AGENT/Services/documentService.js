const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const {
    convertEmlToText
} = require('../Utils/emlConverter');


//Function to extract text from PDF file using pdfparser.
async function extractPdfText(filePath) {
    const parser =
        new PDFParse({
            data: fs.readFileSync(filePath)
        });
    const result =
        await parser.getText();
    return result.text.trim();
}

 //Convert any supported document into plain text because LLM is processing only that format.
 async function loadDocumentContent(filePath) {
    const extension =
        path.extname(filePath)
            .toLowerCase();

    switch (extension) {
        case '.txt':
            return fs.readFileSync(
                filePath,
                'utf8'
            );

        case '.eml':
            return await convertEmlToText(
                filePath
            );

        case '.pdf':
            return await extractPdfText(
                filePath
            );
        default:
            throw new Error(
                `Unsupported file format: ${extension}`
            );
    }
}

//Get all files waiting for processing. Missing funcionality - Today the system reads .eml files from a folder. In production I would integrate with Outlook through Microsoft Graph. Microsoft Graph webhooks would notify the system about new emails and trigger the runAgent workflow automatically. 
function listEmailFiles() {
    const emailFolder = path.join(
        __dirname,
        '..',
        '../DATA',
        'emails'
    );
    console.log('EMAIL FOLDER:', emailFolder);

    const files =
        fs.readdirSync(emailFolder);
    console.log('EMAIL FILES:', files);
    return files.filter(file =>
        file.endsWith('.eml') ||
        file.endsWith('.txt')
    );
}

 //Get all PDF quote files.
function listQuoteFiles() {
    const quoteFolder = path.join(
        __dirname,
        '..',
        '../DATA',
        'quotes'
    );

    return fs.readdirSync(quoteFolder)
        .filter(file =>
            file.endsWith('.pdf')
        );
}


//Move processed file to data/processed folder. 
function moveToProcessed(filePath) {
    const fileName =
        path.basename(filePath);
    const destinationPath =
        path.join(
            __dirname,
            '..',
            '../DATA',
            'processed',
            fileName
        );
    fs.renameSync(
        filePath,
        destinationPath
    );
}

//Move failed file to data/failed folder.
function moveToFailed(filePath) {
    const fileName =
        path.basename(filePath);
    const destinationPath =
        path.join(
            __dirname,
            '..',
            '../DATA',
            'failed',
            fileName
        );

    fs.renameSync(
        filePath,
        destinationPath
    );
}

module.exports = {

    loadDocumentContent,

    listEmailFiles,

    listQuoteFiles,

    moveToProcessed,

    moveToFailed
};