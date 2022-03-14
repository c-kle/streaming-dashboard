import { makePostAPICall } from './utils';
import SessionToken from './resources/sessionToken';

type BandwidthPayload = SessionToken & {
  from: number;
  to: number;
};

type BandwidthResponse = {
  cdn: Array<[number, number]>;
  p2p: Array<[number, number]>;
};

type BandwidthAggregatePayload = BandwidthPayload & {
  aggregate?: 'sum' | 'average' | 'max' | 'min';
};

type BandwidthAggregateResponse = {
  cdn: number;
  p2p: number;
};

export const bandwidth = makePostAPICall<BandwidthPayload, BandwidthResponse>('/bandwidth');
export const bandwidthAggregate = makePostAPICall<
  BandwidthAggregatePayload,
  BandwidthAggregateResponse
>('/bandwidth');
