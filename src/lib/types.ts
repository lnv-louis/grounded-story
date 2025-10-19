import { z } from "zod";

export const ClaimSchema = z.object({
  claim_text: z.string(),
  confidence: z.number().min(0).max(1),
  confidence_explanation: z.string().optional(),
  position: z.number(),
  source_chain: z.string().optional(),
});

export const SourceSchema = z.object({
  outlet_name: z.string(),
  url: z.string().refine((val) => val === "" || z.string().url().safeParse(val).success, {
    message: "Invalid URL",
  }),
  url_valid: z.boolean().optional(),
  publish_date: z.string().nullable().optional(),
  political_lean: z.enum(['left', 'center', 'right']).optional(),
  source_type: z.enum(['primary', 'secondary', 'tertiary']),
  category: z.string().optional(),
  image_url: z.string().optional().refine((val) => !val || val === "" || z.string().url().safeParse(val).success, {
    message: "Invalid URL",
  }),
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
  factual_accuracy: z.number().min(0).max(100),
  factual_accuracy_explanation: z.string().optional(),
  clickbait_level: z.number().min(0).max(100),
  clickbait_explanation: z.string().optional(),
  bias_level: z.number().min(0).max(100),
  bias_explanation: z.string().optional(),
  transparency_score: z.number().min(0).max(1),
  transparency_explanation: z.string().optional(),
  confidence_score: z.number().min(0).max(1),
  confidence_explanation: z.string().optional(),
  spectrum_coverage: z.string(),
  political_distribution: z.object({
    left: z.number(),
    center: z.number(),
    right: z.number(),
  }).optional(),
});

export const AnalysisResultSchema = z.object({
  topic: z.string(),
  headline: z.string(),
  summary: z.string().optional(),
  claims: z.array(ClaimSchema),
  sources: z.array(SourceSchema),
  citations: z.array(CitationSchema),
  edges: z.array(EdgeSchema),
  metrics: MetricsSchema,
  extraction_metadata: z.object({
    content_extracted: z.boolean(),
    original_url: z.string().nullable(),
    extraction_timestamp: z.string(),
  }).optional(),
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
