import {defineArrayMember, defineField} from 'sanity'

// Shared, reusable content-block members (text / image / note). Import
// `contentBlockMembers` into any page-level document's `content` array field
// so every page type (Homepage, About, generic Pages, Service pages) offers
// the exact same set of block options, in the same order, to editors.
export const contentBlockMembers = [
  defineArrayMember({
    name: 'contentText',
    title: 'Text',
    type: 'object',
    fields: [
      defineField({
        name: 'text',
        title: 'Text',
        type: 'text',
        rows: 4,
        validation: (rule) => rule.required(),
      }),
    ],
    preview: {select: {title: 'text'}},
  }),
  defineArrayMember({
    name: 'contentImage',
    title: 'Image',
    type: 'object',
    fields: [
      defineField({
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {hotspot: true},
        validation: (rule) => rule.required(),
      }),
      defineField({name: 'alt', title: 'Alternative text', type: 'string'}),
      defineField({name: 'caption', title: 'Caption', type: 'string'}),
      defineField({
        name: 'circleRegion',
        title: 'Hand-drawn circle region',
        description:
          'Optional. Draw a hand-drawn circle over part of this image by describing the region as percentages of the image (0-100), e.g. top 8, left 10, width 80, height 78. Leave empty for no circle.',
        type: 'object',
        fields: [
          defineField({name: 'top', title: 'Top (%)', type: 'number', validation: (rule) => rule.min(0).max(100)}),
          defineField({name: 'left', title: 'Left (%)', type: 'number', validation: (rule) => rule.min(0).max(100)}),
          defineField({name: 'width', title: 'Width (%)', type: 'number', validation: (rule) => rule.min(0).max(100)}),
          defineField({name: 'height', title: 'Height (%)', type: 'number', validation: (rule) => rule.min(0).max(100)}),
        ],
      }),
    ],
    preview: {select: {title: 'caption', media: 'image'}},
  }),
  defineArrayMember({
    name: 'contentNote',
    title: 'Note',
    type: 'object',
    fields: [
      defineField({
        name: 'kind',
        title: 'Note type',
        type: 'string',
        options: {
          list: [
            {title: 'Sticky note', value: 'sticky'},
            {title: 'Method note', value: 'method'},
            {title: 'Field note', value: 'field'},
          ],
          layout: 'dropdown',
        },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'text',
        title: 'Note text',
        type: 'text',
        rows: 4,
        validation: (rule) => rule.required(),
      }),
    ],
    preview: {select: {title: 'text', subtitle: 'kind'}},
  }),
]

export const contentBlocksField = defineField({
  name: 'content',
  title: 'Content blocks',
  description: 'Add text, images, and notes in the order they should appear on the page.',
  type: 'array',
  of: contentBlockMembers,
})
