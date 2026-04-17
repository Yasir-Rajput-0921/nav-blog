import { defineField, defineType } from "sanity";

export const postType = defineType({  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "id",
      title: "Post ID (slug)",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description (excerpt & SEO)",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageSrc",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageAlt",
      title: "Image Alt Text",
      type: "string",
    }),
    defineField({
      name: "sections",
      title: "Article body",
      description: "Headings and paragraphs shown on the post detail page.",
      type: "array",
      of: [{ type: "contentSection" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      categoryTitle: "category.title",
      media: "imageSrc",
    },
    prepare({ title, categoryTitle, media }) {
      return {
        title: title as string,
        subtitle: categoryTitle as string | undefined,
        media,
      };
    },
  },
});
