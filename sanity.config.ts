"use client";

// Configuración del Studio embebido en /studio.
import {
  documentInternationalization,
  useDeleteTranslationAction,
  useDuplicateWithTranslationsAction,
} from "@sanity/document-internationalization";
import { esESLocale } from "@sanity/locale-es-es";
import { frFRLocale } from "@sanity/locale-fr-fr";
import { visionTool } from "@sanity/vision";
import { defineConfig, type DocumentActionComponent } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/env";
import { languages } from "./src/sanity/languages";
import { resolve } from "./src/sanity/presentation";
import { schemaTypes, singletonTypes, translatedTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

// En el documento único de ajustes solo se puede publicar o descartar cambios.
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

// Borrar y duplicar manteniendo vinculadas las traducciones. El plugin tipa
// `action` como string y Sanity 6 espera una clave concreta: solo es un cast.
const translationActions = [
  useDeleteTranslationAction,
  useDuplicateWithTranslationsAction,
] as DocumentActionComponent[];

export default defineConfig({
  name: "default",
  title: "SBS Abogados",
  basePath: studioUrl,
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
    // Sin plantilla genérica para los tipos traducibles (siempre se crean con
    // idioma) ni para los ajustes (documento único).
    templates: (templates) =>
      templates.filter(
        ({ id, schemaType }) =>
          !singletonTypes.includes(schemaType) &&
          !(translatedTypes.includes(schemaType) && id === schemaType),
      ),
  },

  document: {
    newDocumentOptions: (options) =>
      options.filter(({ templateId }) => !templateId.endsWith("-parameterized")),
    actions: (actions, { schemaType }) => {
      if (singletonTypes.includes(schemaType)) {
        return actions.filter(({ action }) => action && singletonActions.has(action));
      }
      if (translatedTypes.includes(schemaType)) {
        return [...actions, ...translationActions];
      }
      return actions;
    },
  },

  plugins: [
    structureTool({ title: "Contenido", structure }),
    presentationTool({
      title: "Vista previa",
      resolve,
      previewUrl: {
        initial: "/fr",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    documentInternationalization({
      supportedLanguages: languages.map(({ id, title }) => ({ id, title })),
      schemaTypes: translatedTypes,
      apiVersion,
    }),
    // Interfaz del Studio en español; cada usuario puede cambiar a francés.
    esESLocale(),
    frFRLocale(),
    // Consola de consultas GROQ, solo en desarrollo.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
});
