import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import * as clear from "clear";
import akp from "./arrowkeypress";
import * as cp from "child_process";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const emitter = akp(process.stdin);

let lowestIndex = -1;
let currentPath = getUserHome();
let currentIndex = lowestIndex;
let content = fs.readdirSync(currentPath);

printDir(content);

emitter.on("keypress", (key) => {
    switch (key) {
        case "down":
            if (currentIndex < content.length - 1) {
                currentIndex++;
            }
            break;
        case "up":
            if (currentIndex > lowestIndex) {
                currentIndex--;
            }
            break;
    }

    printDir(content);
});

rl.on("line", (line: string) => {
    if (line.length == 0) {
        let newPath = getPath();
        if (fs.statSync(newPath).isDirectory()) {
            changeDir(newPath);
        } else {
            if (newPath.endsWith("jar")) {
                cp.execSync("java -jar " + newPath);
            }
        }
    } else {
        line = line.trim();
        findDir(line);
    }
    printDir(content);
});

function printDir(content: string[]) {
    let chooser = "-> ";
    clear();
    if (currentIndex == -1) {
        console.log(chooser + "..");
    } else {
        console.log("..");
    }
    content.forEach((val, index, arr) => {
        if (index == currentIndex) {
            console.log(chooser + val);
        } else {
            console.log(val);
        }
    });
    rl.prompt();
}

function changeDir(newPath: string) {
    currentPath = newPath;
    currentIndex = -1;
    content = fs.readdirSync(currentPath);
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function findDir(line: string) {
    content.forEach((val, index, arr) => {
        if (val.toLowerCase().startsWith(line.toLowerCase())) {
            currentIndex = index;
            return false;
        }
    });
}

function getPath(): string {
    let selectedPath = currentIndex == -1 ? ".." : content[currentIndex];
    return path.resolve(currentPath, selectedPath);
}