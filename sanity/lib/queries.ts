import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    logo,
    siteName
  }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(id.current) && defined(category->slug.current)] | order(date desc) {
    _id,
    title,
    "id": id.current,
    "category": category->slug.current,
    "categoryTitle": coalesce(category->title, ""),
    "categoryDescription": coalesce(category->description, ""),
    "tag": coalesce(tag, ""),
    description,
    date,
    "imageSrc": coalesce(imageSrc.asset->url, ""),
    "imageAlt": coalesce(imageAlt, "")
  }
`);

export const POSTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "post" && category->slug.current == $category && defined(id.current)] | order(date desc) {
    _id,
    title,
    "id": id.current,
    "category": category->slug.current,
    "categoryTitle": coalesce(category->title, ""),
    "categoryDescription": coalesce(category->description, ""),
    "tag": coalesce(tag, ""),
    description,
    date,
    "imageSrc": coalesce(imageSrc.asset->url, ""),
    "imageAlt": coalesce(imageAlt, "")
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && id.current == $id && category->slug.current == $category][0]{
    _id,
    title,
    "id": id.current,
    "category": category->slug.current,
    "categoryTitle": coalesce(category->title, ""),
    "categoryDescription": coalesce(category->description, ""),
    "tag": coalesce(tag, ""),
    description,
    date,
    "imageSrc": coalesce(imageSrc.asset->url, ""),
    "imageAlt": coalesce(imageAlt, ""),
    "sections": coalesce(sections[]{
      _key,
      heading,
      "paragraphs": coalesce(paragraphs[], [])
    }, [])
  }
`);
