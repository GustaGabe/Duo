import { createTV } from 'tailwind-variants';

const FONT_SIZES = [
  'display',
  'hero',
  'money',
  'title',
  'heading',
  'stat',
  'amount',
  'section',
  'body',
  'label',
  'caption',
  'micro',
  'nano',
];

export const twMergeConfig = {
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZES }],
    },
  },
};

export const tv = createTV({ twMergeConfig });

export type { VariantProps } from 'tailwind-variants';
