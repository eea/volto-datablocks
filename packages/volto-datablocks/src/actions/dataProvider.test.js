import { getDataFromProvider } from './dataProvider';
import {
  getDataProviderHash,
  getDataProviderPayload,
} from '@eeacms/volto-datablocks/helpers';

describe('getDataFromProvider', () => {
  it('uses the canonical payload and hash when no hash is supplied', () => {
    const form = {
      expand: '',
      facilityLocalId: '5000671',
    };
    const dataQuery = [{ i: 'facilityLocalId', v: ['5000671'] }];
    const payload = getDataProviderPayload(form, dataQuery);

    const action = getDataFromProvider('/facility', form, dataQuery);

    expect(action.request.data).toEqual(payload);
    expect(action.hashValue).toBe(
      getDataProviderHash(payload.form, payload.data_query),
    );
  });

  it('preserves an explicitly supplied hash', () => {
    expect(getDataFromProvider('/facility', {}, [], 'known').hashValue).toBe(
      'known',
    );
  });
});
