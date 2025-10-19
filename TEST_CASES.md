# Grounded - Test Cases for Phase 1 & Phase 2

## Phase 1 Test Cases

### 1. Loading Page Animation
**Test ID**: P1-TC-01  
**Feature**: Animated loading sequence  
**Test Steps**:
1. Navigate to homepage
2. Enter a query: "Climate change policies 2025"
3. Submit the search
4. **Expected Results**:
   - Loading page appears with mesh gradient background
   - Progress bar animates from 0 to 100%
   - Steps appear one by one:
     - "Analyzing query..."
     - "Fetching sources..."
     - "Extracting claims..."
     - "Computing metrics..."
     - "Building visualizations..."
     - "Report ready!"
   - Each step transitions smoothly (150ms intervals)
   - After completion, automatically redirects to Results page

---

### 2. Sequential Report Section Animation
**Test ID**: P1-TC-02  
**Feature**: Report sections appear one by one  
**Test Steps**:
1. Complete search and wait for Results page to load
2. **Expected Results**:
   - Sections animate in this order (150ms intervals):
     1. Metrics (circular progress indicators)
     2. Headline & AI Summary
     3. Key Claims
     4. Sources
     5. Relationship Mindmap
   - Each section fades in and slides up
   - Animations are smooth and non-jarring

---

### 3. Metrics Display as Circular Icons
**Test ID**: P1-TC-03  
**Feature**: Metrics shown first as circular progress indicators  
**Test Steps**:
1. Navigate to Results page
2. Observe the Metrics section (should appear first)
3. **Expected Results**:
   - 5 circular progress indicators displayed:
     - Factual Accuracy (green, 0-100%)
     - Clickbait Level (yellow, 0-100%)
     - Bias Level (orange, 0-100%)
     - Transparency (blue, 0-100%)
     - Confidence (purple, 0-100%)
   - Each circle shows percentage in center
   - Progress ring fills according to value
   - Labels are clear and readable

---

### 4. Expandable Metric Explanations
**Test ID**: P1-TC-04  
**Feature**: Click metrics to see explanations  
**Test Steps**:
1. Navigate to Results page
2. Click on "Factual Accuracy" metric
3. Click on "Clickbait Level" metric
4. Click same metric again
5. **Expected Results**:
   - Clicking expands the metric to show explanation card below
   - Only one metric expanded at a time (others auto-collapse)
   - Chevron icon changes from down to up when expanded
   - Clicking again collapses the explanation
   - Animation is smooth (200ms fade/zoom)

---

### 5. Source Hierarchy Visual Distinction
**Test ID**: P1-TC-05  
**Feature**: Primary/Secondary/Tertiary sources clearly differentiated  
**Test Steps**:
1. Navigate to Results page
2. Scroll to Sources section
3. Examine source cards
4. **Expected Results**:
   - Primary sources: Green badge with softer tone (bg-green-500/10)
   - Secondary sources: Yellow badge with softer tone (bg-yellow-500/10)
   - Tertiary sources: Orange badge with softer tone (bg-orange-500/10)
   - Source type badge is prominent on each card
   - Category badge shows (e.g., "news outlet", "government agency")

---

### 6. Political Labels Removed
**Test ID**: P1-TC-06  
**Feature**: No left/right/center political labels displayed  
**Test Steps**:
1. Search for a political topic: "UK election results 2025"
2. Navigate to Results page
3. Check all source cards and claims
4. **Expected Results**:
   - NO "left", "right", or "center" badges visible
   - Political Spectrum Coverage section is completely removed
   - Source cards only show: source type and category
   - No color coding based on political lean

---

### 7. Empty Sources Filtered
**Test ID**: P1-TC-07  
**Feature**: Sources with empty names don't appear  
**Test Steps**:
1. Complete a search that might return incomplete data
2. Navigate to Results page
3. Check Sources section
4. **Expected Results**:
   - Only sources with valid outlet names are displayed
   - Source count matches actual displayed sources
   - No blank or "undefined" source cards
   - Graph only includes nodes for valid sources

---

### 8. Improved Mindmap Graph
**Test ID**: P1-TC-08  
**Feature**: Smaller graph with better visual design  
**Test Steps**:
1. Navigate to Results page
2. Scroll to Relationship Mindmap
3. **Expected Results**:
   - Graph height is 350px (not 500px)
   - Connections are white/semi-transparent (rgba(255, 255, 255, 0.2))
   - Nodes are colored based on type:
     - Article: White
     - Claims: Light blue
     - Sources: Softer red/blue/gray (political lean if available)
   - Nodes have subtle glow effect (shadowBlur: 15)
   - Node size is larger (8px radius)
   - Arrows are visible on connections
   - Labels appear below nodes

---

### 9. Softer Political Spectrum Colors
**Test ID**: P1-TC-09  
**Feature**: Political colors are muted (in CSS variables only)  
**Test Steps**:
1. Check `src/index.css` for color definitions
2. **Expected Results**:
   - `--spectrum-left`: hsl(0 55% 55%) - softer red
   - `--spectrum-center`: hsl(220 10% 50%) - neutral gray
   - `--spectrum-right`: hsl(220 60% 60%) - softer blue
   - Colors are less saturated than pure red/blue

---

## Phase 2 Test Cases

### 10. Shader Gradient Background (Homepage)
**Test ID**: P2-TC-01  
**Feature**: Animated shader gradient on landing page  
**Test Steps**:
1. Navigate to homepage (/)
2. Observe background
3. Wait 10-15 seconds
4. **Expected Results**:
   - 3D water plane shader gradient is visible
   - Gradient colors: #0A0A0A, #7A7A7A, #20d3a8
   - Animation is smooth and continuous
   - Background doesn't interfere with UI elements
   - Search bar and buttons are clearly visible on top
   - No performance lag or stuttering

---

### 11. Claim Hover Popup - Basic Display
**Test ID**: P2-TC-02  
**Feature**: Hover over claim to see source chain popup  
**Test Steps**:
1. Navigate to Results page
2. Hover mouse over first claim card
3. Move mouse around the claim card
4. Move mouse away from claim
5. **Expected Results**:
   - Popup appears 20px to right and below cursor
   - Popup follows mouse movement within card
   - Popup disappears when mouse leaves card
   - Popup has semi-transparent backdrop (bg-card/95)
   - Popup has border with primary color accent
   - Animation is smooth (fade-in, zoom-in, 200ms)

---

### 12. Claim Popup - Source Chain Display
**Test ID**: P2-TC-03  
**Feature**: Popup shows detailed source chain  
**Test Steps**:
1. Hover over a claim with multiple sources in chain
2. Examine popup content
3. **Expected Results**:
   - Header shows "Source Traceability"
   - Confidence badge displays percentage
   - Each source in chain is listed vertically
   - Sources connected by downward arrows (↓)
   - Each source shows:
     - Colored dot (green=primary, yellow=secondary, orange=tertiary)
     - Source name
     - Type badge
     - Category (if available)
     - Publish date (if available)
   - Sources appear in order (secondary → primary)

---

### 13. Claim Popup - Matched Source Details
**Test ID**: P2-TC-04  
**Feature**: Popup enriches data from matched sources  
**Test Steps**:
1. Hover over claim where source names match actual sources
2. **Expected Results**:
   - If source name matches a real source in the sources array:
     - Category is displayed (e.g., "news outlet")
     - Publish date is shown
   - If no match found:
     - Only source name and type shown
   - Matching is case-insensitive and partial

---

### 14. Claim Source Chain Links
**Test ID**: P2-TC-05  
**Feature**: Clickable links in source chain  
**Test Steps**:
1. Navigate to Results page
2. Scroll to Key Claims
3. Look for source chain with URLs
4. Click on a source badge with external link icon
5. **Expected Results**:
   - Source chain displayed below each claim
   - Sources with URLs show external link icon
   - Clicking badge opens URL in new tab
   - Clicking doesn't trigger card hover popup
   - Links work correctly and navigate to source

---

### 15. Multiple Claims Hover Behavior
**Test ID**: P2-TC-06  
**Feature**: Popup only shows for currently hovered claim  
**Test Steps**:
1. Navigate to Results page with multiple claims
2. Hover over Claim 1
3. Move to Claim 2 without leaving cards
4. Move back to Claim 1
5. **Expected Results**:
   - Only one popup visible at a time
   - Popup switches instantly when moving between claims
   - No popup overlap or z-index issues
   - Each popup shows correct data for its claim

---

### 16. Claim Popup - Responsive Positioning
**Test ID**: P2-TC-07  
**Feature**: Popup stays within viewport  
**Test Steps**:
1. Hover over claim near right edge of screen
2. Hover over claim near bottom of viewport
3. **Expected Results**:
   - Popup adjusts position to stay visible
   - Popup doesn't get cut off by viewport edges
   - Max-width prevents overflow (max-w-sm = 384px)
   - Content is always readable

---

### 17. Source Cards with Images
**Test ID**: P2-TC-08  
**Feature**: Source cards display images when available  
**Test Steps**:
1. Complete search that returns sources with image URLs
2. Navigate to Sources section
3. **Expected Results**:
   - Sources with `image_url` show image at top of card
   - Image is 128px height
   - Image scales on hover (scale-105)
   - Image has rounded corners matching card
   - Image is cropped with object-cover
   - Sources without images show no empty space

---

### 18. Source Category Display
**Test ID**: P2-TC-09  
**Feature**: Source cards show category badges  
**Test Steps**:
1. Navigate to Results page
2. Examine source cards
3. **Expected Results**:
   - Category badge appears next to source type
   - Categories like:
     - "news outlet"
     - "government agency"
     - "research institution"
     - "individual"
     - "political party"
   - Category badge has muted styling (bg-muted/50)
   - Badge is visible but not overpowering

---

### 19. Claims List Refactor
**Test ID**: P2-TC-10  
**Feature**: Claims use new ClaimWithPopup component  
**Test Steps**:
1. Check that ClaimsList component receives sources prop
2. Navigate to Results page
3. **Expected Results**:
   - ClaimsList passes sources to each ClaimWithPopup
   - Each claim renders with popup functionality
   - No duplicate source chain display
   - Code is clean and maintainable
   - Props flow correctly: Result → ClaimsList → ClaimWithPopup

---

## Integration Test Cases

### 20. End-to-End Flow
**Test ID**: INT-TC-01  
**Feature**: Complete user journey  
**Test Steps**:
1. Navigate to homepage
2. See shader gradient background
3. Enter query: "Tesla stock analysis"
4. Submit search
5. Watch loading animation
6. Wait for Results page
7. Observe metric circles appear
8. Watch sections animate in
9. Hover over first claim
10. Click on a source in popup
11. Expand Factual Accuracy metric
12. Scroll through all sources
13. **Expected Results**:
   - Every phase transition is smooth
   - No console errors
   - All animations work correctly
   - Popups function properly
   - Links work
   - Metrics expand/collapse
   - Graph is interactive
   - Overall experience is polished

---

### 21. Performance Test
**Test ID**: PERF-TC-01  
**Feature**: App performance under normal use  
**Test Steps**:
1. Open app and measure initial load
2. Submit search query
3. Monitor loading page performance
4. Check Results page render time
5. Test rapid hover on/off claims (20 times)
6. Expand/collapse metrics rapidly (10 times)
7. **Expected Results**:
   - Homepage loads in < 3 seconds
   - Shader gradient runs at 30+ FPS
   - Loading animations are smooth (no frame drops)
   - Results page renders in < 2 seconds
   - Hover popups respond instantly (< 100ms)
   - No memory leaks
   - No console warnings
   - Metrics expand/collapse smoothly

---

### 22. Error Handling
**Test ID**: ERR-TC-01  
**Feature**: Graceful error handling  
**Test Steps**:
1. Enter query that might fail: "asdfasdfasdf1234567890"
2. Disconnect internet before submitting
3. Submit with empty query
4. **Expected Results**:
   - API errors show toast notification
   - User stays on current page
   - Clear error message displayed
   - User can retry
   - No white screen of death
   - Loading state clears on error

---

## Browser Compatibility Tests

### 23. Cross-Browser Testing
**Test ID**: COMP-TC-01  
**Feature**: Works across major browsers  
**Test Steps**:
1. Test in Chrome
2. Test in Firefox
3. Test in Safari
4. Test in Edge
5. **Expected Results**:
   - Shader gradient renders in all browsers
   - Animations work correctly
   - Popups position properly
   - No layout shifts
   - Colors display consistently
   - Performance is acceptable

---

## Accessibility Tests

### 24. Keyboard Navigation
**Test ID**: A11Y-TC-01  
**Feature**: Keyboard accessible  
**Test Steps**:
1. Navigate using Tab key
2. Try to expand metrics with Enter/Space
3. Navigate through claims
4. **Expected Results**:
   - Focus indicators are visible
   - Tab order is logical
   - Expandable elements work with keyboard
   - Links are reachable
   - No keyboard traps

---

### 25. Screen Reader Compatibility
**Test ID**: A11Y-TC-02  
**Feature**: Screen reader friendly  
**Test Steps**:
1. Use screen reader (NVDA/JAWS)
2. Navigate through Results page
3. **Expected Results**:
   - Metrics announce values
   - Claims are read correctly
   - Source chain is understandable
   - Links are properly labeled
   - Badges have meaningful text

---

## Notes for Testers

- **Phase 1** focuses on visual improvements, animations, and better information hierarchy
- **Phase 2** adds shader gradient background and interactive hover popups
- Test on different screen sizes (mobile, tablet, desktop)
- Clear browser cache between tests if experiencing issues
- Report any console errors or warnings
- Note performance issues on lower-end devices
