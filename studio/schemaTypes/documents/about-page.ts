import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {contentBlocksField} from '../objects/content-blocks'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'kicker', title: 'Kicker', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'underlineText',
      title: 'Underline word(s) in title',
      description:
        'Type the exact word or phrase from the title above that should get the hand-drawn underline. Leave empty to underline the whole title.',
      type: 'string',
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [defineArrayMember({type: 'text', rows: 4})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'contactLabel', title: 'Contact label', type: 'string', validation: (rule) => rule.required()}),
    contentBlocksField,
  ],
})
