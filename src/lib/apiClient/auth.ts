import { makePostAPICall } from './makePostAPICall';
import SessionToken from './resources/sessionToken';

interface AuthPayload {
  identifiant: string;
  password: string;
}

export const auth = makePostAPICall<AuthPayload, SessionToken>('/auth');
export const logout = makePostAPICall<SessionToken, {}>('/logout');
