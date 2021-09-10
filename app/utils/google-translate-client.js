import ENV from 'spanish-texter/config/environment';
import fetch from 'fetch';

const LANGUAGE_CODES = {
  english: 'en',
  spanish: 'es',
};

export default class GoogleTranslateClient {
  async translate({ text, from, to }) {
    let requestBody = {
      q: text,
      source: LANGUAGE_CODES[from],
      target: LANGUAGE_CODES[to],
      format: 'text',
    };

    let response = await fetch(this.#url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    let responseBody = await response.json();

    return responseBody.data.translations[0].translatedText;
  }

  #apiKey = ENV.CUSTOM.googleTranslateApiKey;

  get #url() {
    return `https://translation.googleapis.com/language/translate/v2?key=${this.#apiKey}`;
  }
}
