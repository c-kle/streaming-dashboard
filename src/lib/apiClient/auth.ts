import { makePostAPICall } from './utils';
import SessionToken from './resources/sessionToken';

type AuthPayload = {
  identifiant: string;
  password: string;
};

export const auth = makePostAPICall<AuthPayload, SessionToken>('/auth');
