import { Tokens } from '../types/token.type';

const TOKENS = 'tokens';

export const getTokens = (): Tokens | null => {
  const tokesString = localStorage.getItem(TOKENS);
  return tokesString && JSON.parse(tokesString);
}

export const getAccessToken = (): string | null => {
  const tokens = getTokens();
  return tokens && tokens.accessToken;
}

export const getRefreshToken = (): string | null => {
  const tokens = getTokens();
  return tokens && tokens.refreshToken;
}

export const saveTokens = (tokens: Tokens) => {
  localStorage.setItem(TOKENS, JSON.stringify(tokens));
}

export const saveAccessToken = (accessToken: string) => {
  const tokens = getTokens();
  saveTokens(tokens ? {
    ...tokens,
    accessToken
  } as Tokens : { accessToken } as Tokens);
}

export const saveRefreshToken = (refreshToken: string) => {
  const tokens = getTokens();
  saveTokens(tokens ? {
    ...tokens,
    refreshToken
  } as Tokens : { refreshToken } as Tokens);
}

export const removeTokens = () => {
  localStorage.removeItem(TOKENS);
}
