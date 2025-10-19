# Grounded - Changelog

## Update - 2025-10-19 (3)

### Branding
- Added network connection logo to all pages (header)
- Logo represents claim-to-source relationship mapping
- Consistent branding across Index, Results, Auth, and Contact pages

## Update - 2025-10-19 (2)

### Bug Fixes
- Fixed Perplexity API model name from 'llama-3.1-sonar-large-128k-online' to 'sonar-pro'
- Edge function now working with correct model

### Features Added
- Implemented full authentication flow with session management
- Added logout functionality in header
- User state persists across page refreshes
- Removed tagline "Verify facts with multi-perspective source analysis"

### Design Updates
- Added mesh gradient background (white to green) during loading state
- Gradient animates with subtle movement
- Background only shows when search is in progress
- Lovable-style granular gradient effect

---

## Initial Build - 2025-10-19

### Database Schema
- Created `articles` table for storing search queries and results
- Created `claims` table with confidence scores
- Created `sources` table with political_lean (left/center/right) and source_type (primary/secondary/tertiary)
- Created `citations` table linking claims to sources with excerpts
- Created `graph_edges` table for mindmap relationships (cites, derives_from, republishes, contradicts)
- Created `metrics` table for transparency/confidence scores
- Added indexes for performance optimization

### Backend
- Created `analyze-query` edge function using Perplexity Sonar-pro API
- Implemented multi-perspective source retrieval
- Added system prompt for structured JSON output
- Configured CORS headers for public access

### Frontend Components
- **SearchBar**: Animated type-up suggestions for query hints
- **SpectrumBar**: Political spectrum visualization (left-center-right)
- **ClaimsList**: Display claims with confidence badges
- **SourceCard**: Source cards with political lean and type badges
- **MindmapGraph**: Interactive D3 force-directed graph for source relationships
- **MetricsDisplay**: Transparency and confidence score visualization

### Pages
- **Index**: Home page with search bar, logo, Contact/Login buttons
- **Results**: Full analysis display with claims, spectrum, sources, mindmap, metrics
- **Auth**: Login/signup page with email/password
- **Contact**: Contact form page

### Design System
- Black dominant background (#0a0a0a)
- White foreground for high contrast
- Custom semantic tokens for political spectrum colors
- Minimalist card designs with subtle borders
- Smooth transitions and hover effects

### TypeScript + Zod
- Defined schemas for all data types (Claim, Source, Citation, Edge, Metrics)
- Runtime validation with zod
- Full end-to-end type safety from API → DB → UI

### Dependencies Added
- react-force-graph-2d (for mindmap visualization)
- three (peer dependency for force graph)
- d3 (for graph utilities)
- zod (already installed for validation)
