import {CogIcon} from '@sanity/icons/Cog'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {HomeIcon} from '@sanity/icons/Home'
import {ImageIcon} from '@sanity/icons/Image'
import type {StructureResolver} from 'sanity/structure'

const singleton = (
  S: Parameters<StructureResolver>[0],
  typeName: 'siteSettings' | 'homePage' | 'aboutPage',
  title: string,
  icon: typeof CogIcon,
) => S.listItem().title(title).icon(icon).child(S.document().schemaType(typeName).documentId(typeName).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Offcut content')
    .items([
      singleton(S, 'siteSettings', 'Site settings', CogIcon),
      singleton(S, 'homePage', 'Homepage', HomeIcon),
      singleton(S, 'aboutPage', 'About page', DocumentTextIcon),
      S.divider(),
      S.documentTypeListItem('page').title('Pages').icon(DocumentTextIcon),
      S.documentTypeListItem('servicePage').title('Service pages').icon(DocumentTextIcon),
      S.documentTypeListItem('inspirationItem').title('Inspiration').icon(ImageIcon),
    ])
