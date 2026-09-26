// lib/templates/registry.ts
import dynamic from "next/dynamic";

export const templates = {
  default: dynamic(() => import("./default/DefaultTemplate")),
  cafeAnime: dynamic(() => import("./cafe-anime/CafeAnimeTemplate")),
  kramen: dynamic(() => import("./kramenskardu/kramenskardutemplate")),
  aljannat: dynamic(() => import("./aljannat/aljannat"))
} as const;

export type TemplateId = keyof typeof templates;

export function getTemplate(templateId?: string) {
  return templates[(templateId as TemplateId)] ?? templates.default;
}