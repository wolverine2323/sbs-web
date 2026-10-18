import { BookIcon } from "@sanity/icons/Book";
import { CaseIcon } from "@sanity/icons/Case";
import { CogIcon } from "@sanity/icons/Cog";
import { CommentIcon } from "@sanity/icons/Comment";
import { ComposeIcon } from "@sanity/icons/Compose";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HomeIcon } from "@sanity/icons/Home";
import { MasterDetailIcon } from "@sanity/icons/MasterDetail";
import { StarIcon } from "@sanity/icons/Star";
import { TagIcon } from "@sanity/icons/Tag";
import { UsersIcon } from "@sanity/icons/Users";
import type { ComponentType } from "react";
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { apiVersion } from "./env";
import { languages } from "./languages";

// Lista de un tipo traducible: todos los documentos y una sublista por idioma.
// Crear desde una sublista ya asigna ese idioma.
function byLanguage(S: StructureBuilder, type: string, title: string, icon: ComponentType) {
  return S.listItem()
    .id(type)
    .title(title)
    .icon(icon)
    .schemaType(type)
    .child(
      S.list()
        .id(type)
        .title(title)
        .items([
          S.listItem()
            .id(`${type}-all`)
            .title("Todos los idiomas")
            .schemaType(type)
            .child(S.documentTypeList(type).title(title)),
          S.divider(),
          ...languages.map(({ id, title: languageName }) =>
            S.listItem()
              .id(`${type}-${id}`)
              .title(languageName)
              .schemaType(type)
              .child(
                S.documentList()
                  .id(`${type}-${id}`)
                  .title(`${title} · ${languageName}`)
                  .schemaType(type)
                  .apiVersion(apiVersion)
                  .filter("_type == $type && language == $language")
                  .params({ type, language: id })
                  .initialValueTemplates([S.initialValueTemplateItem(`${type}-${id}`)]),
              ),
          ),
        ]),
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .id("pages")
        .title("Páginas")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .id("pages")
            .title("Páginas")
            .items([
              S.documentTypeListItem("homePage").title("Portada").icon(HomeIcon),
              byLanguage(S, "sectionPage", "Páginas de sección", MasterDetailIcon),
              byLanguage(S, "service", "Servicios", CaseIcon),
              byLanguage(S, "investGuide", "Guía del inversor", BookIcon),
              byLanguage(S, "caseStudy", "Experiencias (casos)", StarIcon),
              byLanguage(S, "page", "Páginas generales", DocumentTextIcon),
            ]),
        ),
      S.listItem()
        .id("blog")
        .title("Blog")
        .icon(ComposeIcon)
        .child(
          S.list()
            .id("blog")
            .title("Blog")
            .items([
              byLanguage(S, "post", "Artículos", ComposeIcon),
              byLanguage(S, "category", "Categorías", TagIcon),
            ]),
        ),
      byLanguage(S, "teamMember", "Equipo", UsersIcon),
      S.listItem()
        .id("testimonial")
        .title("Testimonios")
        .icon(CommentIcon)
        .schemaType("testimonial")
        .child(
          S.documentTypeList("testimonial")
            .title("Testimonios")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .id("siteSettings")
        .title("Configuración")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Ajustes del sitio"),
        ),
    ]);
