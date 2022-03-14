import { makePostAPICall } from './utils';
import SessionToken from './resources/sessionToken';

type AudiencePayload = SessionToken & {
  from: number;
  to: number;
};

type AudienceResponse = { audience: Array<[number, number]> };

export const audience = makePostAPICall<AudiencePayload, AudienceResponse>('/audience');
