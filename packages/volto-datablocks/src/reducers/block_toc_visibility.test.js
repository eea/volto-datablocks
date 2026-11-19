import reducer from './block_toc_visibility';
import { setBlockTocVisibility } from '../actions/blockTocVisibility';

describe('block_toc_visibility reducer', () => {
  it('stores the visibility keyed by block', () => {
    const state = reducer(undefined, setBlockTocVisibility('uid::b1', false));

    expect(state).toEqual({ 'uid::b1': false });
  });

  it('keeps the previous state reference when nothing changes', () => {
    const initial = reducer(undefined, setBlockTocVisibility('uid::b1', true));

    expect(reducer(initial, setBlockTocVisibility('uid::b1', true))).toBe(
      initial,
    );
  });

  it('ignores unrelated actions', () => {
    const initial = reducer(undefined, { type: 'UNRELATED' });

    expect(initial).toEqual({});
  });
});
