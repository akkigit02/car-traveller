const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const { minify: minifyJs } = require('terser');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');


// Directories and files to be processed
const projectDir = path.join(__dirname, '../../client');
const outputDir = path.join(__dirname, '../../../build'); // temprary
const ignore = ['app', '.DS_Store']
const projectOutputDir = path.join(__dirname, '../../../www.dddcabs.com');


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
function minifyJsFile(filePath) {
    try {
        let jsContent = fs.readFileSync(filePath, 'utf-8');
        const localhostRegex = /http:\/\/localhost:\d+/g;
        jsContent = jsContent
            .replace(/http:\/\/127.0.0.1:3000/g, 'https://www.dddcabs.com/car-booking')
            .replace(/http:\/\/127.0.0.1:3001/g, 'https://www.dddcabs.com/car-booking')
            .replace(/http:\/\/127.0.0.1:5000/g, 'https://www.dddcabs.com/car-booking')
            .replace(/http:\/\/127.0.0.1:5001/g, 'https://www.dddcabs.com/car-booking')
            .replace(localhostRegex, 'https://www.dddcabs.com/car-booking');
        const minifiedJs = UglifyJS.minify(jsContent);

        fs.writeFileSync(filePath.replace(projectDir, outputDir), minifiedJs.code);
        console.log(`Minified JS: ${filePath}`);
    } catch (err) {
        console.error(`Error minifying JS: ${filePath}`, err);
    }
}

// Helper function to recursively walk through directories
async function processFiles(dir) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
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
                await minifyHtmlFile(fullPath);
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
    }

}

const deleteDir = (directoryPath) => {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const fullPath = `${directoryPath}/${file}`
            if (fs.lstatSync(fullPath).isDirectory())
                fs.rmdirSync(fullPath, { recursive: true, force: true })
            else
                fs.unlinkSync(fullPath)
        })
    }
}



const move = (source, destination) => {
    if (!fs.existsSync(destination))
        fs.mkdirSync(destination, { recursive: true });
    fs.readdirSync(source).forEach((file) => {
        const sourceFullPath = `${source}/${file}`
        const destinationFullPath = `${destination}/${file}`
        if (fs.lstatSync(sourceFullPath).isDirectory())
            fs.mkdirSync(destinationFullPath, { recursive: true });
        fs.renameSync(sourceFullPath, destinationFullPath)
    })
};

(async () => {
    if (fs.existsSync(outputDir))
        deleteDir(outputDir)
    else
        fs.mkdirSync(outputDir, { recursive: true });
    await processFiles(projectDir);
    deleteDir(projectOutputDir)
    move(outputDir, projectOutputDir)
    deleteDir(outputDir)
})()
