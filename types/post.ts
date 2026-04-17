export interface BlogCategory {
  _id: string;
  title: string;
  slug: string;
  description: string;
}

export interface BlogPostSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogPostSectionSource {
  _key?: string;
  heading?: string | null;
  paragraphs?: string[] | null;
}

export interface BlogPost {
  _id: string;
  id: string;
  category: string;
  categoryTitle: string;
  categoryDescription: string;
  tag: string;
  title: string;
  description: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  sections?: BlogPostSectionSource[];
}
