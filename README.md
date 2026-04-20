# React 100 — Real-World Engineering Practice Problems

A job-simulation training system containing 100 industry-style React coding problems.
No solutions are provided. Each problem is a standalone engineering task.

---

## Start Here — Before Any Problem

| File | What it does |
|---|---|
| [INTERVIEW-APPROACH.md](INTERVIEW-APPROACH.md) | **Read this first.** The 5-step framework for attacking any React problem in an interview. Decision trees, talking points, what to say when stuck. |
| [STARTER-TEMPLATE.md](STARTER-TEMPLATE.md) | Fill this out before coding each problem. Prevents blank-screen panic. Worked examples included. |
| [PERFORMANCE-PATTERNS.md](PERFORMANCE-PATTERNS.md) | 12 React performance patterns with code examples. The expert performance vocabulary every interview expects. |

---

## How to Use This Repo

1. **Read `INTERVIEW-APPROACH.md` once** — internalize the 5-step framework.
2. **Before each problem**, fill out the `STARTER-TEMPLATE.md` for that problem on paper/scratch.
3. **Build the feature** as if it ships to production.
4. **After building**, check `PERFORMANCE-PATTERNS.md` — did you apply the relevant patterns?
5. **Practice saying your decisions out loud** — interviews are 50% verbal reasoning.

---

## Folder Structure

```
react-100-problems/
├── README.md
├── INTERVIEW-APPROACH.md       ← Start here
├── STARTER-TEMPLATE.md         ← Fill this before each problem
├── PERFORMANCE-PATTERNS.md     ← Performance expert reference
└── problems/
    ├── 01-live-search-debounce.md          ← Has "Where to Start" section
    ├── 07-shopping-cart-persistence.md     ← Has "Where to Start" section
    ├── 11-virtual-scrolling-list.md        ← Has "Where to Start" section
    ├── 02-infinite-scroll-feed.md
    ├── 03-multi-step-form-wizard.md
    ├── 04-data-table-sort-filter-pagination.md
    ├── 05-jwt-auth-token-refresh.md
    ├── 06-analytics-dashboard-widgets.md
    ├── 08-global-modal-manager.md
    ├── 09-autocomplete-search-input.md
    ├── 10-drag-drop-kanban-board.md
    ├── 12-realtime-notification-system.md
    ├── 13-file-upload-progress.md
    ├── 14-date-range-picker.md
    ├── 15-role-based-access-ui.md
    ├── 16-optimistic-ui-updates.md
    ├── 17-dynamic-form-fields.md
    ├── 18-collapsible-tree-navigator.md
    ├── 19-multi-select-dropdown-filter.md
    ├── 20-image-gallery-lazy-loading.md
    ├── 21-tabbed-interface-routing.md
    ├── 22-toast-notification-system.md
    ├── 23-command-palette.md
    ├── 24-data-export-feature.md
    ├── 25-nested-comments-replies.md
    ├── 26-user-profile-settings-page.md
    ├── 27-admin-user-management-table.md
    ├── 28-order-tracking-timeline.md
    ├── 29-rich-text-preview.md
    ├── 30-currency-converter-live-rates.md
    ├── 31-permission-guard-component.md
    ├── 32-customizable-dashboard-layout.md
    ├── 33-bulk-action-system.md
    ├── 34-session-timeout-warning.md
    ├── 35-responsive-mega-menu.md
    ├── 36-stepper-progress-tracker.md
    ├── 37-tag-input-component.md
    ├── 38-resizable-panels.md
    ├── 39-chart-zoom-filter.md
    ├── 40-theme-switcher.md
    ├── 41-product-configurator.md
    ├── 42-audit-log-viewer.md
    ├── 43-feature-flag-ui.md
    ├── 44-calendar-event-scheduler.md
    ├── 45-error-boundary-system.md
    ├── 46-collaborative-presence-indicator.md
    ├── 47-advanced-filter-builder.md
    ├── 48-virtualized-data-grid.md
    ├── 49-multi-tenant-dashboard.md
    ├── 50-api-rate-limit-indicator.md
    ├── 51-polling-data-refresh.md
    ├── 52-faceted-search-filters.md
    ├── 53-form-validation-engine.md
    ├── 54-report-builder.md
    ├── 55-keyboard-navigation-component.md
    ├── 56-data-diff-viewer.md
    ├── 57-breadcrumb-dynamic-route.md
    ├── 58-onboarding-flow.md
    ├── 59-subscription-plan-selector.md
    ├── 60-notification-preferences-panel.md
    ├── 61-ab-testing-ui-component.md
    ├── 62-undo-redo-system.md
    ├── 63-context-menu.md
    ├── 64-table-column-configurator.md
    ├── 65-price-calculator.md
    ├── 66-multi-language-selector.md
    ├── 67-live-preview-editor.md
    ├── 68-retry-failed-request-ui.md
    ├── 69-document-upload-manager.md
    ├── 70-timeline-activity-feed.md
    ├── 71-approval-workflow-ui.md
    ├── 72-resource-usage-monitor.md
    ├── 73-code-snippet-display.md
    ├── 74-data-masking-component.md
    ├── 75-activity-heatmap.md
    ├── 76-wizard-validation-gates.md
    ├── 77-csv-import-preview.md
    ├── 78-accordion-faq.md
    ├── 79-split-view-layout.md
    ├── 80-metric-card-trend.md
    ├── 81-password-strength-meter.md
    ├── 82-email-template-builder.md
    ├── 83-priority-queue-manager.md
    ├── 84-geo-filter-ui.md
    ├── 85-timezone-selector.md
    ├── 86-recurring-event-scheduler.md
    ├── 87-smart-table-cell-editing.md
    ├── 88-api-key-manager.md
    ├── 89-relationship-graph-viewer.md
    ├── 90-token-usage-dashboard.md
    ├── 91-sticky-header-scroll-state.md
    ├── 92-deep-link-state-manager.md
    ├── 93-cache-first-data-fetcher.md
    ├── 94-stale-data-indicator.md
    ├── 95-form-auto-save.md
    ├── 96-side-panel-drawer.md
    ├── 97-animation-trigger-system.md
    ├── 98-advanced-permission-matrix.md
    ├── 99-realtime-chat-interface.md
    └── 100-admin-panel-integration.md
```

---

## What Each Problem File Contains

Every problem has:
- **Problem Statement** — industry-style feature description
- **Expected Behavior** — precise UX requirements
- **Where to Start** (problems 01, 07, 11 + use STARTER-TEMPLATE for all others)
- **Required React Concepts** — explicit hooks and patterns
- **Constraints** — rules that force correct implementation
- **Performance Notes** — the performance risks and solutions for that specific problem
- **Edge Cases** — the tricky scenarios interviewers probe for

---

## Performance Vocabulary Cheat Sheet

Use these phrases in interviews:

| Situation | Say this |
|---|---|
| Long list | "I'd virtualize this — only render visible rows" |
| Input + API | "I'd debounce this by 400ms to avoid N requests for N characters" |
| Stale response | "I'd use AbortController to cancel the previous request" |
| Passing function to child | "I'd wrap this in useCallback since it's a prop to a memoized child" |
| Expensive filter | "This goes in useMemo with the data and query as dependencies" |
| Multiple components, same data | "I'd deduplicate the request at the fetch layer" |
| Context causing re-renders | "I'd split the context into state and dispatch — dispatch never changes" |
| Timer in effect | "I store the timer ID in useRef and clear it in the cleanup function" |

---

> This repo contains no solutions. Build everything from scratch.
