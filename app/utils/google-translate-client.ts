import ENV from 'spanish-texter/config/environment';
import fetch from 'fetch';
import { Language } from 'custom-types';

const LANGUAGE_CODES: Record<Language, string> = {
  english: 'en',
  spanish: 'es',
};

interface TranslateNamedParams {
  text: string;
  from: Language;
  to: Language;
}

export default class GoogleTranslateClient {
  async translate({ text, from, to }: TranslateNamedParams): Promise<string> {
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

  get #url(): string {
    return `https://translation.googleapis.com/language/translate/v2?key=${this.#apiKey}`;
  }
}
