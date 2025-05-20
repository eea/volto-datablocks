/*
 * Utilities to humanize numbers and other data
 */

import Humanize from 'humanize-plus';
import { isNumber } from 'lodash';
import config from '@plone/volto/registry';

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
};

export function formatValue(value, format = 'raw') {
  if (typeof value === 'undefined' || value === null) return '';

  if (typeof value === 'string') {
    let formattedValue = value
    for (const key of Object.keys(config.settings.formatters)) {
      formattedValue = config.settings.formatters[key](formattedValue)
    }

    return formattedValue
  }

  return valueFormatters[format](value);
}
