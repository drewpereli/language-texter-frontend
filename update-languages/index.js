/* eslint-disable node/no-unsupported-features/es-syntax */
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import yaml from 'js-yaml';
import fs from 'fs/promises';
import path from 'path';
import glob from 'glob-promise';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANSLATIONS_PATH = path.resolve(__dirname, '../translations');
const ENGLISH_DOC_PATH = path.resolve(TRANSLATIONS_PATH, './en.yaml');

function main() {
  translateFiles(['zh.yaml']);
}

async function translateFiles(includedFiles) {
  let englishDocText = String(await fs.readFile(ENGLISH_DOC_PATH));
  let englishYaml = yaml.load(englishDocText);

  // Get all other translation files
  let translationFiles = await glob(path.resolve(TRANSLATIONS_PATH, '*.yaml'));

  let nonEnglishFiles = translationFiles.filter((file) => {
    let baseName = path.basename(file);
    return baseName !== 'en.yaml';
  });

  let filesToTranslate;

  if (includedFiles) {
    filesToTranslate = nonEnglishFiles.filter((file) => {
      return includedFiles.includes(path.basename(file));
    });
  } else {
    filesToTranslate = nonEnglishFiles;
  }

  for (let file of filesToTranslate) {
    await updateFileFromEnglishYaml(englishYaml, file);
  }
}

async function updateFileFromEnglishYaml(englishYaml, file) {
  let languageCode = path.basename(file).split('.')[0];

  let translatedJson = await getTranslatedObj(englishYaml, languageCode);

  let translatedYaml = yaml.dump(translatedJson);

  await fs.writeFile(file, translatedYaml);
}

async function getTranslatedObj(obj, languageCode) {
  let newObj = {};

  let keys = Object.keys(obj);

  for (let key of keys) {
    let val = obj[key];
    let translated;

    if (typeof val !== 'string') {
      translated = await getTranslatedObj(val, languageCode);
    } else {
      translated = await translate(val, languageCode);
    }

    newObj[key] = translated;
  }

  return newObj;
}

async function translate(text, languageCode) {
  let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;

  let requestBody = {
    q: text,
    source: 'en',
    target: languageCode,
    format: 'text',
  };

  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  let responseBody = await response.json();

  if (!responseBody.data) {
    console.log(responseBody.error.errors);
  } else {
    return responseBody.data.translations[0].translatedText;
  }
}

main();
