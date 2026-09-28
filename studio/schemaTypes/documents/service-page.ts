import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cardDescription',
      title: 'Homepage card description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 5, validation: (rule) => rule.required()}),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'serviceTopic',
          title: 'Service topic',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'underlineText',
              title: 'Underline word(s) in title',
              description:
                'Type the exact word or phrase from the title above that should get the hand-drawn underline (e.g. "analysis"). Leave empty to underline the whole title.',
              type: 'string',
            }),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            defineField({
              name: 'question',
              title: 'Question',
              description: 'Existing topic question. New editorial content can also be added below.',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'metric',
              title: 'Metric',
              description: 'Existing topic metric or key figure.',
              type: 'string',
            }),
            defineField({
              name: 'fieldNote',
              title: 'Field note',
              description: 'Existing topic field note. New editorial content can also be added below.',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'content',
              title: 'Topic content',
              description: 'Add text, images, and notes in the order they should appear on the page.',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'topicText',
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
                  name: 'topicImage',
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
                  name: 'topicNote',
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
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
