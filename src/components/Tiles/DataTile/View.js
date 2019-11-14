/**
 * View text tile.
 * @module components/manage/Tiles/Text/View
 */

import PropTypes from 'prop-types';
import React from 'react';

/**
 * View text tile class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => {
  return <div>Hello World</div>;
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
