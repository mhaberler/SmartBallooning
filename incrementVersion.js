// Import necessary modules
import { readFileSync, writeFileSync } from 'fs';
import {replaceInFile} from 'replace-in-file';
import semver from 'semver';

// Function to increment versionCode
function incrementVersionCode(currentCode) {
    return parseInt(currentCode, 10) + 1;
}

// Function to increment versionName
function incrementVersionName(currentVersion) {
    return semver.inc(currentVersion, 'patch');
}

// Read the current Gradle file
const gradleFile = './android/app/build.gradle';
const content = readFileSync(gradleFile, 'utf-8');

// Regular expressions to find versionCode and versionName
const versionCodeRegex = /versionCode\s+(\d+)/;
const versionNameRegex = /versionName\s+['"]([^'"]+)['"]/;

// Extract current versions
const versionCodeMatch = content.match(versionCodeRegex);
const versionNameMatch = content.match(versionNameRegex);

if (!versionCodeMatch || !versionNameMatch) {
    console.error('Could not find versionCode or versionName in the Gradle file.');
    process.exit(1);
}

const currentVersionCode = versionCodeMatch[1];
const currentVersionName = versionNameMatch[1];

// Increment versions
const newVersionCode = incrementVersionCode(currentVersionCode);
const newVersionName = incrementVersionName(currentVersionName);

// Replace in file
try {
    await replaceInFile({
        files: gradleFile,
        from: [versionCodeRegex, versionNameRegex],
        to: [`versionCode ${newVersionCode}`, `versionName '${newVersionName}'`]
    });
    console.log(`Updated versionCode to ${newVersionCode} and versionName to ${newVersionName}`);
} catch (error) {
    console.error('Error occurred:', error);
}