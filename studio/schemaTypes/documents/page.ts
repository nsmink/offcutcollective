import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'
import {contentBlocksField} from '../objects/content-blocks'

// Generic page document, at the same level as the About page. Editors can
// create as many of these as needed (e.g. Contact, Team, Manifesto) directly
// in Studio without a developer adding a new route/schema by hand. Every
// page created from this type gets the standard header/footer treatment and
// the same content-block options as Homepage, About, and Service pages.
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Controls the page URL, e.g. "team" becomes /team.',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'kicker', title: 'Kicker', type: 'string'}),
    defineField({
      name: 'underlineText',
      title: 'Underline word(s) in title',
      description:
        'Type the exact word or phrase from the title above that should get the hand-drawn underline. Leave empty to underline the whole title.',
      type: 'string',
    }),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 5}),
    contentBlocksField,
    defineField({name: 'contactLabel', title: 'Contact label', type: 'string'}),
    defineField({
      name: 'showInFooterNav',
      title: 'Show in footer navigation',
      description: 'Add a link to this page in the site footer navigation.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare: ({title, subtitle}) => ({title, subtitle: subtitle ? `/${subtitle}` : undefined}),
  },
})
