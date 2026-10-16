import { category } from "./documents/category";
import { homePage } from "./documents/homePage";
import { investGuide } from "./documents/investGuide";
import { page } from "./documents/page";
import { post } from "./documents/post";
import { service } from "./documents/service";
import { siteSettings } from "./documents/siteSettings";
import { teamMember } from "./documents/teamMember";
import { testimonial } from "./documents/testimonial";
import { accessibleImage } from "./objects/accessibleImage";
import { blockContent } from "./objects/blockContent";
import { localeString, localeText } from "./objects/localized";
import { seo } from "./objects/seo";

export const schemaTypes = [
  // Documentos
  siteSettings,
  homePage,
  service,
  investGuide,
  page,
  post,
  category,
  teamMember,
  testimonial,
  // Objetos
  accessibleImage,
  blockContent,
  localeString,
  localeText,
  seo,
];

// Un documento por idioma, con las traducciones vinculadas por el plugin.
export const translatedTypes = [
  "homePage",
  "service",
  "investGuide",
  "page",
  "post",
  "category",
  "teamMember",
];

export const singletonTypes = ["siteSettings"];
