import ENV from 'spanish-texter/config/environment';
import fetch from 'fetch';
import Language from 'spanish-texter/models/language';

interface TranslateNamedParams {
  text: string;
  from: Language['code'];
  to: Language['code'];
}

export default class GoogleTranslateClient {
  async translate({ text, from, to }: TranslateNamedParams): Promise<string> {
    let requestBody = {
      q: text,
      source: from,
      target: to,
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
