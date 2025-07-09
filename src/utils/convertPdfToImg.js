const fs = require("fs");
const path = require("path");
const pdf = require("pdf-poppler");

/**
 * Converts a PDF to an image (PNG) and returns local image path.
 */
async function convertPdfToImage(pdfPath, outputDir = "./public/converted") {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const opts = {
        format: "png",
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: 1 // Only convert the first page
    };

    try {
        await pdf.convert(pdfPath, opts);
        const imagePath = path.join(
            outputDir,
            `${opts.out_prefix}-${opts.page}.png`
        );
        return imagePath;
    } catch (err) {
        throw new Error("Failed to convert PDF to image: " + err.message);
    }
}

module.exports = { convertPdfToImage };
