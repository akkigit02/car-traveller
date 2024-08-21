const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const { minify: minifyJs } = require('terser');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');


// Directories and files to be processed
const projectDir = path.join(__dirname, '../../client');
const outputDir = path.join(__dirname, '../../../public_html');
const ignore = ['app', '.DS_Store']

// Function to minify HTML
async function minifyHtmlFile(filePath) {
    try {
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const minifiedHtml = await minifyHtml(htmlContent, {
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: false,  // handled separately
            minifyCSS: false, // handled separately
        });

        fs.writeFileSync(filePath.replace(projectDir, outputDir), minifiedHtml);
        console.log(`Minified HTML: ${filePath}`);
    } catch (err) {
        console.error(`Error minifying HTML: ${filePath}`, err);
    }
}

// Function to minify CSS
function minifyCssFile(filePath) {
    try {
        const cssContent = fs.readFileSync(filePath, 'utf-8');
        const minifiedCss = new CleanCSS({}).minify(cssContent).styles;

        fs.writeFileSync(filePath.replace(projectDir, outputDir), minifiedCss);
        console.log(`Minified CSS: ${filePath}`);
    } catch (err) {
        console.error(`Error minifying CSS: ${filePath}`, err);
    }
}

// Function to minify JS
async function minifyJsFile(filePath) {
    try {
        const jsContent = fs.readFileSync(filePath, 'utf-8');
        const minifiedJs = UglifyJS.minify(jsContent);

        fs.writeFileSync(filePath.replace(projectDir, outputDir), minifiedJs.code);
        console.log(`Minified JS: ${filePath}`);
    } catch (err) {
        console.error(`Error minifying JS: ${filePath}`, err);
    }
}

// Helper function to recursively walk through directories
function processFiles(dir) {
    fs.readdirSync(dir).forEach((file) => {
        console.log(file)
        const fullPath = path.join(dir, file);
        if (ignore.includes(file)) {
            // 
        }
        else if (fs.lstatSync(fullPath).isDirectory()) {
            const outputSubDir = fullPath.replace(projectDir, outputDir);
            if (!fs.existsSync(outputSubDir)) {
                fs.mkdirSync(outputSubDir, { recursive: true });
            }
            processFiles(fullPath);
        } else {
            if (fullPath.endsWith('.html')) {
                minifyHtmlFile(fullPath);
            } else if (fullPath.endsWith('.css')) {
                minifyCssFile(fullPath);
            } else if (fullPath.endsWith('.js')) {
                minifyJsFile(fullPath);
            } else {
                // Copy other files like images to the output directory
                const outputFilePath = fullPath.replace(projectDir, outputDir);
                fs.copyFileSync(fullPath, outputFilePath);
                console.log(`Copied: ${fullPath}`);
            }
        }
    });
}

// if (fs.existsSync(outputDir))
//     fs.rmSync(outputDir, { recursive: true, force: true });
// Copy project assets and minify
fs.mkdirSync(outputDir, { recursive: true });
processFiles(projectDir);
