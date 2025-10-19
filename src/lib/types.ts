import { z } from "zod";

export const ClaimSchema = z.object({
  claim_text: z.string(),
  confidence: z.number().min(0).max(1),
  position: z.number(),
});

export const SourceSchema = z.object({
  outlet_name: z.string(),
  url: z.string().url(),
  publish_date: z.string().optional(),
  political_lean: z.enum(['left', 'center', 'right']),
  source_type: z.enum(['primary', 'secondary', 'tertiary']),
});

export const CitationSchema = z.object({
  claim_index: z.number(),
  source_index: z.number(),
  excerpt: z.string(),
  rationale: z.string().optional(),
  page_number: z.string().optional(),
});

export const EdgeSchema = z.object({
  source_index: z.number(),
  target_index: z.number(),
  edge_type: z.enum(['cites', 'derives_from', 'republishes', 'contradicts']),
});

export const MetricsSchema = z.object({
  transparency_score: z.number().min(0).max(1),
  confidence_score: z.number().min(0).max(1),
  spectrum_coverage: z.string(),
});

export const AnalysisResultSchema = z.object({
  topic: z.string(),
  headline: z.string(),
  claims: z.array(ClaimSchema),
  sources: z.array(SourceSchema),
  citations: z.array(CitationSchema),
  edges: z.array(EdgeSchema),
  metrics: MetricsSchema,
});

export type Claim = z.infer<typeof ClaimSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type Citation = z.infer<typeof CitationSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Metrics = z.infer<typeof MetricsSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export interface GraphNode {
  id: string;
  name: string;
  type: 'article' | 'claim' | 'source';
  political_lean?: 'left' | 'center' | 'right';
  source_type?: 'primary' | 'secondary' | 'tertiary';
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'cites' | 'derives_from' | 'republishes' | 'contradicts';
}
