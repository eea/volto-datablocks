import { getTocVisibilityKey, makeTocVisibilityKey } from './tocVisibility';

describe('toc visibility key helpers', () => {
  it('scopes the key by content uid and block id', () => {
    expect(makeTocVisibilityKey('uid-1', 'block-1')).toBe('uid-1::block-1');
  });

  it('falls back to the block id when there is no content uid', () => {
    expect(makeTocVisibilityKey(undefined, 'block-1')).toBe('block-1');
  });

  it('returns null without a block id', () => {
    expect(makeTocVisibilityKey('uid-1', undefined)).toBeNull();
    expect(getTocVisibilityKey({ UID: 'uid-1' }, undefined)).toBeNull();
  });

  it('reads the content uid from metadata or properties', () => {
    expect(getTocVisibilityKey({ UID: 'uid-1' }, 'block-1')).toBe(
      'uid-1::block-1',
    );
    expect(getTocVisibilityKey({ '@id': 'http://x/uid-1' }, 'block-1')).toBe(
      'http://x/uid-1::block-1',
    );
  });
});
