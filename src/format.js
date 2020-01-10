/*
 * Utilities to humanize numbers and other data
 */

import Humanize from 'humanize-plus';
import { isNumber } from 'lodash';

export const dataFormatChoices = [
  { id: 'raw', label: 'Raw value' },
  { id: 'compactnumber', label: 'Compact number' },
  { id: 'percentage', label: 'percentage' },
];

function valueIsNumber(value) {
  return (
    isNumber(value) ||
    (typeof value === 'string' && value.match(/^(-?\d+\.\d+)$|^(-?\d+)$/))
  );
}

export const valueFormatters = {
  raw: value => value,
  compactnumber: value => {
    return (
      (value && isNumber(value) && Humanize.compactInteger(value, 1)) || value
    );
  },
  percentage: value => {
    return (
      (value &&
        valueIsNumber(value) &&
        `${Humanize.compactInteger(value, 1)}%`) ||
      value
    );
  },
};

export function formatValue(value, format = 'raw') {
  if (typeof value === 'undefined' || value === null) return '';
  return valueFormatters[format](value);
}
