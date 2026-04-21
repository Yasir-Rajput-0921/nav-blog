import { defineField, defineType } from "sanity";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "string",
    }),
    defineField({
        name: "provider",
        title: "Provider",
        type: "string",
    }),
    defineField({
        name: "createdAt",
        title: "Created At",
        type: "datetime",
    }),
  ],
});