import type { ContentPage } from "@/data/content-pages";
import { contentPages } from "@/data/content-pages";
import type { LeadershipMessage } from "@/data/leadership";
import { leadershipMessages } from "@/data/leadership";
import type { EnrichmentPage } from "@/data/enrichment";
import { enrichmentPage } from "@/data/enrichment";

export type EditablePageKey =
  | "board-chair-message"
  | "school-administrator-message"
  | "fee-structure"
  | "sports-co-curricular";

export type DashboardLeadershipMessagePage = {
  key: "board-chair-message" | "school-administrator-message";
  label: string;
  kind: "leadership-message";
  content: LeadershipMessage;
  updatedAt: string;
};

export type DashboardFeePage = {
  key: "fee-structure";
  label: string;
  kind: "fee-structure";
  content: ContentPage;
  updatedAt: string;
};

export type DashboardEnrichmentPage = {
  key: "sports-co-curricular";
  label: string;
  kind: "enrichment";
  content: EnrichmentPage;
  updatedAt: string;
};

export type DashboardEditablePage =
  | DashboardLeadershipMessagePage
  | DashboardFeePage
  | DashboardEnrichmentPage;

export const editablePageDefinitions: readonly DashboardEditablePage[] = [
  {
    key: "board-chair-message",
    label: "Board Chair message",
    kind: "leadership-message",
    content: leadershipMessages.boardChair,
    updatedAt: "",
  },
  {
    key: "school-administrator-message",
    label: "Executive School Administrator message",
    kind: "leadership-message",
    content: leadershipMessages.schoolAdministrator,
    updatedAt: "",
  },
  {
    key: "fee-structure",
    label: "Fee structure",
    kind: "fee-structure",
    content: contentPages.feeStructure,
    updatedAt: "",
  },
  {
    key: "sports-co-curricular",
    label: "Sports, swimming & co-curricular",
    kind: "enrichment",
    content: enrichmentPage,
    updatedAt: "",
  },
];

export function getEditablePageDefinition(key: string) {
  return editablePageDefinitions.find((page) => page.key === key);
}
