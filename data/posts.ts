import { BlogPost, BlogPostSection, PostCategory } from "@/types/post";

export const CATEGORY_SEO: Record<PostCategory, { label: string; description: string }> = {
  tech: {
    label: "Technology",
    description: "Technology articles about JavaScript, React, AI tools, and modern web development.",
  },
  travel: {
    label: "Travel",
    description: "Travel guides, budget tips, destination ideas, and practical trip planning content.",
  },
  food: {
    label: "Food",
    description: "Food stories, recipes, and practical cooking tips for everyday meals.",
  },
};

export const CATEGORY_LINKS: Array<{ label: string; href: string; key: "all" | PostCategory }> = [
  { label: "All Posts", href: "/", key: "all" },
  { label: "Technology", href: "/tech", key: "tech" },
  { label: "Travel", href: "/travel", key: "travel" },
  { label: "Food", href: "/food", key: "food" },
];

export function getSafeCategory(value?: string): PostCategory | undefined {
  if (value === "tech" || value === "travel" || value === "food") {
    return value;
  }

  return undefined;
}

export function isInvalidCategory(value?: string): boolean {
  if (!value) {
    return false;
  }

  return getSafeCategory(value) === undefined;
}

export function hasInvalidCategoryQuery(params: Record<string, string | string[] | undefined>): boolean {
  const queryKeys = Object.keys(params);

  if (queryKeys.length === 0) {
    return false;
  }

  if (queryKeys.some(function isUnknownKey(key) { return key !== "category"; })) {
    return true;
  }

  const categoryValue = params.category;

  if (Array.isArray(categoryValue)) {
    return true;
  }

  if (categoryValue === undefined || categoryValue.trim() === "") {
    return true;
  }

  return isInvalidCategory(categoryValue);
}

export function filterPosts(category?: PostCategory): BlogPost[] {
  if (!category) {
    return BLOG_POSTS;
  }

  return BLOG_POSTS.filter(function filterByCategory(post) {
    return post.category === category;
  });
}

export function getCategoryLabel(category: PostCategory): string {
  return CATEGORY_SEO[category].label;
}

export function getCategoryDescription(category: PostCategory): string {
  return CATEGORY_SEO[category].description;
}

export function getAllCategories(): PostCategory[] {
  return Object.keys(CATEGORY_SEO) as PostCategory[];
}

export function getCategoryPostCount(category: PostCategory): number {
  return filterPosts(category).length;
}

export function getPostUrl(post: Pick<BlogPost, "category" | "id">): string {
  return `/${post.category}/${post.id}`;
}

export function hasBlogPostCoverImage(post: Pick<BlogPost, "imageSrc">): boolean {
  return post.imageSrc.trim() !== "";
}

export function getBlogPostCoverPlaceholderText(post: Pick<BlogPost, "imageSrc" | "imageAlt">): string {
  if (hasBlogPostCoverImage(post)) {
    return "";
  }

  return post.imageAlt.trim();
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "js-30-days",
    category: "tech",
    tag: "Technology",
    title: "How to Learn JavaScript in 30 Days",
    description:
      "A practical roadmap with daily tasks, project ideas, and free resources to stay consistent.",
    date: "Apr 10, 2026",
    imageSrc: "/images/tech-java.jpg",
    imageAlt: "JavaScript coding setup for a technology article",
  },
  {
    id: "lahore-places",
    category: "travel",
    tag: "Travel",
    title: "Top Places to Visit in Lahore Pakistan",
    description:
      "From food streets to heritage sites, here is a balanced one-day and weekend trip plan.",
    date: "Apr 08, 2026",
    imageSrc: "/images/travel-lhr.jpg",
    imageAlt: "Lahore city travel view",
  },
  {
    id: "chicken-biryani",
    category: "food",
    tag: "Food",
    title: "Authentic Chicken Biryani at Home",
    description:
      "Step-by-step ingredients, spice timing, and cooking tricks for restaurant-like flavor.",
    date: "Apr 06, 2026",
    imageSrc: "/images/food-biryani.jpg",
    imageAlt: "A plate of chicken biryani",
  },
  {
    id: "react-vs-vue",
    category: "tech",
    tag: "Technology",
    title: "React vs Vue: Which One Should You Pick?",
    description:
      "A side-by-side comparison of learning curve, ecosystem, job market, and real use-cases.",
    date: "Apr 04, 2026",
    imageSrc: "/images/tech-react.jpg",
    imageAlt: "React and Vue comparison concept image",
  },
  {
    id: "budget-travel",
    category: "travel",
    tag: "Travel",
    title: "Smart Budget Travel Tips for 2026",
    description:
      "Use these booking, packing, and itinerary methods to reduce costs without losing comfort.",
    date: "Apr 02, 2026",
    imageSrc: "",
    // /images/travel-plan.jpg
    imageAlt: "Travel planning essentials on a table",
  },
  {
    id: "protein-breakfast",
    category: "food",
    tag: "Food",
    title: "5 Quick High-Protein Breakfast Ideas",
    description:
      "Healthy and fast meals for students and professionals who want energy for the whole day.",
    date: "Mar 30, 2026",
    imageSrc: "/images/food-breakfast.jpg",
    imageAlt: "High-protein breakfast plate",
  },
  {
    id: "ai-tools-students",
    category: "tech",
    tag: "Technology",
    title: "AI Tools Every Student Should Use",
    description:
      "Improve writing, research, and coding speed with a realistic AI toolkit that saves hours each week.",
    date: "Mar 28, 2026",
    imageSrc: "/images/tech-ai.jpg",
    imageAlt: "AI tools and laptop workspace",
  },
  {
    id: "portfolio-clients",
    category: "tech",
    tag: "Technology",
    title: "How to Build a Portfolio Website That Gets Clients",
    description:
      "Structure your projects, write better case studies, and position your skills for freelance leads.",
    date: "Mar 26, 2026",
    imageSrc: "/images/tech-portfolio.jpg",
    imageAlt: "Developer portfolio website on a laptop",
  },
  {
    id: "northern-road-trip",
    category: "travel",
    tag: "Travel",
    title: "Northern Pakistan Road Trip Checklist",
    description: "A complete packing, budgeting, and safety checklist for scenic road adventures.",
    date: "Mar 24, 2026",
    imageSrc: "",
    // /images/johny-goerend-_CVsfum13-E-unsplash.jpg
    imageAlt: "",
    // Mountain road trip in northern Pakistan
  },
  {
    id: "weekend-getaway",
    category: "travel",
    tag: "Travel",
    title: "How to Plan a Weekend Getaway in 20 Minutes",
    description:
      "Use this fast planning framework to choose routes, stays, and activities without overwhelm.",
    date: "Mar 22, 2026",
    imageSrc: "/images/pietro-de-grandi-T7K4aEPoGGk-unsplash.jpg",
    imageAlt: "Weekend getaway landscape view",
  },
  {
    id: "street-food-favorites",
    category: "food",
    tag: "Food",
    title: "Street Food Favorites You Must Try Once",
    description:
      "A curated list of iconic snacks and where to find the most authentic flavor in local markets.",
    date: "Mar 20, 2026",
    imageSrc: "/images/food-street.jpg",
    imageAlt: "Street food selection in a local market",
  },
  {
    id: "meal-prep-budget",
    category: "food",
    tag: "Food",
    title: "Meal Prep on a Budget for One Week",
    description:
      "Affordable ingredient list and time-saving prep flow to make healthy meals all week long.",
    date: "Mar 18, 2026",
    imageSrc: "/images/food-meal.jpg",
    imageAlt: "Meal prep containers for a weekly plan",
  },
];

const BASE_SECTION_INTRO: Record<PostCategory, string> = {
  tech:
    "Technology moves quickly, but steady systems beat random hype. This guide keeps the process practical so you can move from confusion to confident execution.",
  travel:
    "Great trips are designed before they are booked. The goal of this guide is to help you travel with less stress, fewer surprises, and better memories.",
  food:
    "Good food is repeatable when method is clear. This guide explains the reasoning behind each step so your result stays consistent every time.",
};

const CATEGORY_PLAYBOOK: Record<PostCategory, string[]> = {
  tech: [
    "Start with a clear scope. Define one primary outcome and two measurable checkpoints. This prevents context switching and keeps learning momentum high.",
    "Build in public-friendly milestones. Small demos create feedback loops and reveal blind spots before they become expensive rework.",
    "Choose tools for maintainability over novelty. Favor ecosystems with healthy documentation, stable release cadence, and strong debugging stories.",
  ],
  travel: [
    "Decide the trip shape first: relaxed, balanced, or high-energy. Your daily pace should match your actual energy, not social media expectations.",
    "Reserve essentials early and keep optional blocks flexible. This gives structure while preserving room for spontaneous local experiences.",
    "Use lightweight checklists for transport, documents, and weather adjustments. A clean checklist removes 80% of avoidable travel stress.",
  ],
  food: [
    "Prioritize preparation before cooking. Correct ingredient setup usually determines flavor consistency more than cooking speed.",
    "Control heat in stages instead of maximum flame all the time. Gradual heat gives better texture and keeps spices from turning bitter.",
    "Taste intentionally at checkpoints: base seasoning, mid-cook balance, and final adjustment. This creates predictable, repeatable outcomes.",
  ],
};

const EXECUTION_SYSTEM: Record<PostCategory, string[]> = {
  tech: [
    "Week planning works best when tasks are outcome-based, not hour-based. Ask: what will be visibly better after this block?",
    "For complex topics, use a layered approach: first principles, guided implementation, then independent practice. This avoids shallow memorization.",
    "Track decisions in short notes. Future-you will benefit from knowing why a pattern was chosen, not only what was implemented.",
  ],
  travel: [
    "Anchor each day around one major activity, one food experience, and one recovery window. Balanced days are easier to sustain across a full trip.",
    "Keep transport buffers realistic. Add margin for traffic, platform changes, and local payment friction so delays do not break the entire day.",
    "Document expenses while moving. Real-time logging makes budget decisions objective and prevents unpleasant surprises at the end.",
  ],
  food: [
    "Sequence your workflow: prep, base flavor, core cooking, and finishing. Clear sequencing reduces errors and improves timing.",
    "Small technique upgrades compound: dry ingredients correctly, control moisture, and rest food before serving when required.",
    "Store leftovers with intent. Labeling date and use-case turns leftovers into planned meals instead of random waste.",
  ],
};

const QUALITY_CHECKS: Record<PostCategory, string[]> = {
  tech: [
    "Quality means reliable behavior under normal and edge scenarios. Validate success criteria before adding extra features.",
    "Review from the user perspective: speed, clarity, and trust signals. A technically correct solution still fails if user confidence is weak.",
    "Treat iteration as a system. Close each cycle with one improvement, one lesson, and one simplification.",
  ],
  travel: [
    "A high-quality trip feels calm, not rushed. Keep one low-pressure slot each day for reflection or unexpected opportunities.",
    "Respect local norms and context. Cultural awareness improves safety, social interactions, and overall experience depth.",
    "After the trip, capture what worked and what did not. Your next itinerary will become faster, cheaper, and more enjoyable.",
  ],
  food: [
    "Quality is consistency across repetitions. If today worked, write down ingredient ratios and timing so future attempts stay stable.",
    "Use contrast to improve plate experience: texture, temperature, and freshness. Balanced contrast makes simple dishes feel premium.",
    "Reflect after serving: flavor accuracy, prep efficiency, and storage quality. Small weekly improvements build kitchen confidence quickly.",
  ],
};

function getPostFocusParagraph(post: BlogPost): string {
  return `${post.title} is most useful when you translate ideas into repeatable habits. Instead of relying on motivation bursts, use compact routines that are easy to maintain during busy weeks. This approach improves results while reducing mental load.`;
}

function getCategoryActionPlan(category: PostCategory): string[] {
  return CATEGORY_PLAYBOOK[category];
}

function getExecutionNotes(category: PostCategory): string[] {
  return EXECUTION_SYSTEM[category];
}

function getQualityChecklist(category: PostCategory): string[] {
  return QUALITY_CHECKS[category];
}

export function getPostContentSections(post: BlogPost): BlogPostSection[] {
  const intro = BASE_SECTION_INTRO[post.category];
  const plan = getCategoryActionPlan(post.category);
  const execution = getExecutionNotes(post.category);
  const quality = getQualityChecklist(post.category);

  return [
    {
      heading: "Why This Matters",
      paragraphs: [intro, getPostFocusParagraph(post), post.description],
    },
    {
      heading: "Practical Playbook",
      paragraphs: plan,
    },
    {
      heading: "Execution Framework",
      paragraphs: execution,
    },
    {
      heading: "Quality and Long-Term Improvement",
      paragraphs: quality,
    },
  ];
}

export function getPostByCategoryAndId(category: PostCategory, postId: string): BlogPost | undefined {
  return BLOG_POSTS.find(function matchPost(post) {
    return post.category === category && post.id === postId;
  });
}

export function getAllPostRouteParams(): Array<{ category: PostCategory; postId: string }> {
  return BLOG_POSTS.map(function mapPost(post) {
    return {
      category: post.category,
      postId: post.id,
    };
  });
}

export function getRelatedPosts(post: BlogPost, limit: number = 3): BlogPost[] {
  return BLOG_POSTS.filter(function filterRelated(item) {
    return item.category === post.category && item.id !== post.id;
  }).slice(0, limit);
}
