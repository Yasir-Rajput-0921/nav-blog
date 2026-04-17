export type PostCategory = "tech" | "travel" | "food";

export interface BlogPost {
  id: string;
  category: PostCategory;
  tag: string;
  title: string;
  description: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
}

export interface BlogPostSection {
  heading: string;
  paragraphs: string[];
}
