const path = require("node:path")
const fs = require("node:fs")
const events = require("node:events")
const stream = require("node:stream")
const os = require("node:os")
const zLib = require("node:zlib")


const path = require('path');
const fs = require('fs');
const os = require('os');
const EventEmitter = require('events');
const { pipeline } = require('stream');
const zlib = require('zlib');

// 1
function logCurrentPath() {
    console.log({ File: __filename, Dir: __dirname });
}

// 2
function getFileName(filePath) {
    return path.basename(filePath);
}

// 3
function buildPath(pathObj) {
    return path.format(pathObj);
}

// 4
function getFileExtension(filePath) {
    return path.extname(filePath);
}

// 5
function parseFilePath(filePath) {
    const parsed = path.parse(filePath);
    return { Name: parsed.name, Ext: parsed.ext };
}

// 6
function isAbsolutePath(filePath) {
    return path.isAbsolute(filePath);
}

// 7
function joinSegments(...segments) {
    return path.join(...segments);
}

// 8
function resolveToAbsolute(relativePath) {
    return path.resolve(relativePath);
}

// 9
function joinTwoPaths(path1, path2) {
    return path.join(path1, path2);
}

// 10
function deleteFileAsync(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) console.error(err);
        else console.log(`The ${path.basename(filePath)} is deleted.`);
    });
}

// 11
function createFolderSync(folderPath) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log("Success");
}

// 12
const myEmitter = new EventEmitter();
myEmitter.on('start', () => {
    console.log("Welcome event triggered!");
});

// 13
myEmitter.on('login', (username) => {
    console.log(`User logged in: ${username}`);
});

// 14
function readFileSyncLog(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`the file content => "${content}"`);
}

// 15
function writeToFileAsync(filePath, content) {
    fs.writeFile(filePath, content, (err) => {
        if (err) throw err;
        console.log("Write completed asynchronously.");
    });
}

// 16
function checkDirExists(dirPath) {
    return fs.existsSync(dirPath);
}

// 17
function getOsAndCpuInfo() {
    return { Platform: os.platform(), Arch: os.arch() };
}

// 18
function readInChunks(filePath) {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    readStream.on('data', (chunk) => {
        console.log("log each chunk\n", chunk);
    });
}

// 19
function copyFileUsingStreams(sourcePath, destPath) {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath);
    readStream.pipe(writeStream);
    writeStream.on('finish', () => {
        console.log("File copied using streams");
    });
}

// 20
function compressFilePipeline(sourcePath, destPath) {
    pipeline(
        fs.createReadStream(sourcePath),
        zlib.createGzip(),
        fs.createWriteStream(destPath),
        (err) => {
            if (err) console.error("Pipeline failed", err);
            else console.log("File compressed successfully");
        }
    );
}


