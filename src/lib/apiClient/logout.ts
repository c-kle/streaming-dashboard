import { makePostAPICall } from './makePostAPICall';
import SessionToken from './resources/sessionToken';

export const logout = makePostAPICall<SessionToken, {}>('/logout');
