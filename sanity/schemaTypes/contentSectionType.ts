import { defineField, defineType } from "sanity";

export const contentSectionType = defineType({
  name: "contentSection",
  title: "Content section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      validation: (Rule) => Rule.min(1).error("Add at least one paragraph"),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title as string };
    },
  },
});
