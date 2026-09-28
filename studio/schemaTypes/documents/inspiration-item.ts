import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const inspirationItem = defineType({
  name: 'inspirationItem',
  title: 'Inspiration item',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'underlineText',
      title: 'Underline word(s) in title',
      description:
        'Type the exact word or phrase from the title above that should get the hand-drawn underline. Leave empty to underline the whole title.',
      type: 'string',
    }),
    defineField({name: 'dateLabel', title: 'Date or source label', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({
      name: 'promoteOnHomepage',
      title: 'Promote on homepage',
      description: 'Show this item in the yellow Inspiration block on the homepage. If several items are selected, the most recently updated one is shown.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'circleRegion',
      title: 'Hand-drawn circle region',
      description:
        'Optional. Draw a hand-drawn circle over part of the image above by describing the region as percentages of the image (0-100), e.g. top 8, left 10, width 80, height 78. Leave empty for no circle.',
      type: 'object',
      fields: [
        defineField({name: 'top', title: 'Top (%)', type: 'number', validation: (rule) => rule.min(0).max(100)}),
        defineField({name: 'left', title: 'Left (%)', type: 'number', validation: (rule) => rule.min(0).max(100)}),
        defineField({name: 'width', title: 'Width (%)', type: 'number', validation: (rule) => rule.min(0).max(100)}),
        defineField({name: 'height', title: 'Height (%)', type: 'number', validation: (rule) => rule.min(0).max(100)}),
      ],
    }),
  ],
})
