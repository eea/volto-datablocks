/*
 * Utilities to humanize numbers and other data
 */

import Humanize from 'humanize-plus';
import { isNumber } from 'lodash';

export const dataFormatChoices = [
  { id: 'raw', label: 'Raw value' },
  { id: 'compactnumber', label: 'Compact number' },
  { id: 'percentage', label: 'Compact percentage' },
  {
    id: 'percentage_format_precise',
    label: 'Percentage format with 2 precision',
  },
  { id: 'format_precise_one', label: 'Format with 1 precision' },

  { id: 'format_precise', label: 'Format with 2 precision' },
  { id: 'format_int', label: 'Format as whole number' },
  { id: 'square_brackets_to_italic', label: 'Format square brackets pattern to italic' },
];

function valueIsNumber(value) {
  return (
    isNumber(value) ||
    (typeof value === 'string' && value.match(/^(-?\d+\.\d+)$|^(-?\d+)$/))
  );
}

export const valueFormatters = {
  raw: (value) => value,
  compactnumber: (value) => {
    return (
      (value && isNumber(value) && Humanize.compactInteger(value, 1)) || value
    );
  },
  percentage: (value) => {
    return (
      (value &&
        valueIsNumber(value) &&
        `${Humanize.compactInteger(value, 1)}%`) ||
      value
    );
  },
  format_precise: (value) => {
    return (
      (value && valueIsNumber(value) && `${Humanize.formatNumber(value, 2)}`) ||
      value
    );
  },
  format_precise_one: (value) => {
    return (
      (value && valueIsNumber(value) && `${Humanize.formatNumber(value, 1)}`) ||
      value
    );
  },
  percentage_format_precise: (value) => {
    return (
      (value &&
        valueIsNumber(value) &&
        `${Humanize.formatNumber(value, 2)}%`) ||
      value
    );
  },
  format_int: (value) => {
    return (
      (value && valueIsNumber(value) && `${Humanize.intComma(value)}`) || value
    );
  },
  square_brackets_to_italic: (value) => {
    return (value && typeof value === 'string' && value.replace(/\[(.*?)\]/g, '<em>$1</em>')) || value;
  },
};

export function isCustomFormat(specifier) {
  return Object.prototype.hasOwnProperty.call(valueFormatters, specifier);
}

export function formatValue(value, format = 'raw') {
  if (typeof value === 'undefined' || value === null) return '';
  return valueFormatters[format](value);
}
