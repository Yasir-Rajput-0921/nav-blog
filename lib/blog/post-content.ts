import type { BlogPost, BlogPostSection, BlogPostSectionSource } from "@/types/post";

function normalizeSections(sections: BlogPostSectionSource[] | undefined): BlogPostSection[] {
  if (!sections || sections.length === 0) {
    return [];
  }

  return sections
    .filter(function hasHeading(section): section is BlogPostSectionSource & { heading: string } {
      return typeof section.heading === "string" && section.heading.trim() !== "";
    })
    .map(function mapSection(section) {
      const paragraphs = Array.isArray(section.paragraphs)
        ? section.paragraphs.filter(function nonEmpty(p): p is string {
          return typeof p === "string" && p.trim() !== "";
        })
        : [];

      return {
        heading: section.heading.trim(),
        paragraphs,
      };
    })
    .filter(function hasBody(section) {
      return section.paragraphs.length > 0;
    });
}

export function getPostContentSections(post: BlogPost): BlogPostSection[] {
  const fromCms = normalizeSections(post.sections);

  if (fromCms.length > 0) {
    return fromCms;
  }

  return [
    {
      heading: "Overview",
      paragraphs: [post.description],
    },
  ];
}
