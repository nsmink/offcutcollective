import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'
import {contentBlocksField} from '../objects/content-blocks'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heroLabel',
      title: 'Hero label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroStatement',
      title: 'Hero statement',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'inspirationTitle',
      title: 'Inspiration title',
      description: 'Used when there is no promoted Inspiration item.',
      type: 'string',
    }),
    defineField({
      name: 'inspirationDescription',
      title: 'Inspiration description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      ...contentBlocksField,
      description: 'Optional editorial content shown between the homepage introduction and service cards.',
    }),
  ],
})
