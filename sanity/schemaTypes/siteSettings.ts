export const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    {
        name: "logo",
        title: "Logo",
        type: "image",
        options: {
            hotspot: true,
        },
    },
    {
      name: "siteName",
      title: "Site Name",
      type: "string",
    },
  ],
};