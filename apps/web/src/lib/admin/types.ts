export type AdminRole = "SUPER_ADMIN" | "CONTENT_EDITOR" | "ADMISSIONS_MANAGER";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export type AdminSession = {
  accessToken: string;
  expiresAt: string | null;
  user: AdminUser;
};

export type LoginResponse = {
  accessToken: string;
  user: AdminUser;
};

export type LeadStatus = "NEW" | "CONTACTED" | "CLOSED" | "DISCARDED";

export type ProgramStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ContentType = "HERO" | "SECTION" | "CTA" | "TEXT" | "IMAGE" | "FAQ";

export type MediaAssetType = "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER";

export type MediaAssetStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type MediaAssetSource = "EXTERNAL_URL" | "LOCAL_UPLOAD";

export type ProgramReorderDirection = "up" | "down";

export type Program = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  studyPlan: string | null;
  duration: string | null;
  modality: string | null;
  imageUrl: string | null;
  position: number;
  status: ProgramStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProgramPayload = {
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  studyPlan?: string;
  duration?: string;
  modality?: string;
  imageUrl?: string;
  position?: number;
  status: ProgramStatus;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string;
  coverImageUrl: string | null;
  status: PublishStatus;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostPayload = {
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  body: string;
  coverImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: PublishStatus;
  publishedAt?: string;
};

export type PageSeo = {
  id: string;
  pageKey: string;
  title: string;
  description: string;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PageSeoPayload = {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
};

export type PublicDocument = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  url: string;
  mediaAssetId: string;
  linkedPageKey: string;
  linkedSectionKey: string | null;
  mediaAsset: MediaAsset;
  position: number;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
};

export type PublicDocumentPayload = {
  title: string;
  slug: string;
  category: string;
  summary?: string;
  mediaAssetId: string;
  linkedPageKey: string;
  linkedSectionKey?: string;
  position?: number;
  status: PublishStatus;
};

export type Lead = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  message: string | null;
  status: LeadStatus;
  programId: string | null;
  createdAt: string;
  updatedAt: string;
  program: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

export type ContentBlock = {
  id: string;
  page: string;
  key: string;
  type: ContentType;
  title: string | null;
  body: string | null;
  mediaUrl: string | null;
  position: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContentPayload = {
  page: string;
  key: string;
  type: ContentType;
  title?: string;
  body?: string;
  mediaUrl?: string;
  position?: number;
  status: ContentStatus;
};

export type MediaAsset = {
  id: string;
  title: string;
  altText: string | null;
  url: string;
  type: MediaAssetType;
  source: MediaAssetSource;
  storageKey: string | null;
  status: MediaAssetStatus;
  createdAt: string;
  updatedAt: string;
};

export type MediaAssetPayload = {
  title: string;
  altText?: string;
  url: string;
  type: MediaAssetType;
  status: MediaAssetStatus;
};
