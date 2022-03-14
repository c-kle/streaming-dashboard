import { makePostAPICall } from './utils';
import SessionToken from './resources/sessionToken';

export const logout = makePostAPICall<SessionToken, {}>('/logout');
