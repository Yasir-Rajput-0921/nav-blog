import type { SchemaTypeDefinition } from "sanity";

import { categoryType } from "./categoryType";
import { contentSectionType } from "./contentSectionType";
import { postType } from "./postType";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, contentSectionType, postType, siteSettings],
};
