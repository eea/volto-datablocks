/**
 * Helpers to share the runtime visibility of conditional data blocks with the
 * table of contents block via the `blockTocVisibility` reducer.
 * @module components/manage/Blocks/ConditionalDataBlock/tocVisibility
 */

/**
 * Build the visibility key from an explicit content uid and block id. It is
 * scoped by content uid so that the same block id on different pages (or
 * repeated content) does not collide.
 *
 * @function makeTocVisibilityKey
 * @param {string} contentUid The content uid.
 * @param {string} id The block id.
 * @returns {string|null} The visibility key, or null when it cannot be built.
 */
export const makeTocVisibilityKey = (contentUid, id) => {
  if (!id) return null;
  return contentUid ? `${contentUid}::${id}` : id;
};

/**
 * Build the visibility key from the content metadata (or properties).
 *
 * @function getTocVisibilityKey
 * @param {Object} metadata The content metadata (or properties).
 * @param {string} id The block id.
 * @returns {string|null} The visibility key, or null when it cannot be built.
 */
export const getTocVisibilityKey = (metadata, id) =>
  makeTocVisibilityKey(metadata?.UID || metadata?.['@id'], id);
