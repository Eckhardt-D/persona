import {fetch} from 'undici';

export interface GithubConstructorOptions {
  client_id: string;
  client_secret: string;
}

export interface GetTokenOptions {
  code: string;
}

export interface GetTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
}

export interface GetUserByTokenOptions {
  token: string;
}

export type GetUserEmailByTokenOptions = GetUserByTokenOptions;

export interface GetUserByTokenResponse {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  blog: string | null;
  bio: string | null;
  login: string;
}

export interface EmailResponse {
  email: string;
  verified: boolean;
  primary: boolean;
  visibility: string;
}

export class GitHub {
  private client_id: string;
  private client_secret: string;

  constructor(options: GithubConstructorOptions) {
    if (!options.client_id || !options.client_secret) {
      throw new Error('Incorrect options passed to github.');
    }

    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
  }

  public async getToken(options: GetTokenOptions) {
    if (!options.code) {
      throw new Error('Could not get token, code invalid.');
    }

    const url = 'https://github.com/login/oauth/access_token';

    const requestParams = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      code: options.code,
    };

    const response = (await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestParams),
    }).then(res => res.json())) as GetTokenResponse;

    return response.access_token;
  }

  public async getUserByToken(options: GetUserByTokenOptions) {
    if (!options.token) {
      throw new Error();
    }

    const url = 'https://api.github.com/user';

    const response = (await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `token ${options.token}`,
      },
    }).then(res => res.json())) as GetUserByTokenResponse;

    return response;
  }

  public async getUserEmailByLogin(options: GetUserEmailByTokenOptions) {
    if (!options.token) {
      throw new Error();
    }

    const url = 'https://api.github.com/user/emails';
    const emails = (await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `token ${options.token}`,
      },
    }).then(res => res.json())) as EmailResponse[];

    return emails.find(m => !!m.primary)?.email;
  }
}
