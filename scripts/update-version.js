const fs = require('fs');
const path = require('path');
const versionFilePath = path.resolve(__dirname, '../src/assets/version.json');
const versionFile = require(versionFilePath);

const buildType = process.argv[2]; // dev | uat | prod

if (!buildType || !['dev', 'uat', 'prod'].includes(buildType)) {
  console.error('❌ Invalid build type. Use: dev | uat | prod');
  process.exit(1);
}

// Map environment files
const fileMap = {
  dev: './src/environment/environment.dev.ts',
  uat: './src/environment/environment.uat.ts',
  prod: './src/environment/environment.prod.ts',
};

const envFilePath = fileMap[buildType];

// Read current environment file
let envFileContent = fs.readFileSync(envFilePath, 'utf-8');

// Extract previous version
let previousVersionMatch = envFileContent.match(/version:\s*['"]([^'"]+)['"]/);
let previousVersion = previousVersionMatch ? previousVersionMatch[1] : '0.0.0';
console.log(previousVersion);

// Remove old -env-timestamp suffix if it exists
let baseVersion = previousVersion.replace(/-(dev|uat|prod)-\d{8}T\d{6}$/, '');

// Split into major.minor.patch
let [major, minor, patch] = baseVersion.split('.').map(Number);

// Increment patch
patch = (patch || 0) + 1;
if (patch > 9) {
  patch = 0;
  minor = (minor || 0) + 1;
}
if (minor > 9) {
  minor = 0;
  major = (major || 0) + 1;
}

// New base version
let newBaseVersion = `${major}.${minor}.${patch}`;

// Add environment type and timestamp
const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
const finalVersion = `${newBaseVersion}`;

// Replace version in file
envFileContent = envFileContent.replace(
  /version\s*:\s*['"][^'"]+['"]/,
  `version: '${finalVersion}'`
);
console.log("build", buildType);

if(buildType === 'prod') {
  versionFile.prodVersion = finalVersion;
}
if(buildType === 'uat') {
  versionFile.uatVersion = finalVersion;
}

fs.writeFileSync(versionFilePath, JSON.stringify(versionFile, null, 2));


// Write updated content
fs.writeFileSync(envFilePath, envFileContent);

console.log(`Updated ${buildType} environment version to: ${finalVersion}`);
