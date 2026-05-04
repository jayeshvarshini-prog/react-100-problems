import { useState, Suspense, lazy } from 'react';

const modules = import.meta.glob('./*.jsx');

const NotBuilt = () => (
  <p style={{ padding: '2rem', color: '#888' }}>Not built yet</p>
);

function lazyLoad(filename) {
  const importer = modules[`./${filename}`];
  if (!importer) return NotBuilt;
  return lazy(importer);
}

const PROBLEMS = [
  { id: 1,   label: '01 — Live Search & Debounce',      file: 'live_search_and_debounce.jsx' },
  { id: 2,   label: '02 — Infinite Scroll',             file: 'infinite_scroll.jsx' },
  { id: 3,   label: '03 — Modal / Dialog',              file: 'modal.jsx' },
  { id: 4,   label: '04 — Accordion',                   file: 'accordion.jsx' },
  { id: 5,   label: '05 — Tabs',                        file: 'tabs.jsx' },
  { id: 6,   label: '06 — Toast Notification',          file: 'toast_notification.jsx' },
  { id: 7,   label: '07 — Form Validation',             file: 'form_validation.jsx' },
  { id: 8,   label: '08 — Autocomplete',                file: 'autocomplete.jsx' },
  { id: 9,   label: '09 — Drag and Drop',               file: 'drag_and_drop.jsx' },
  { id: 10,  label: '10 — Pagination',                  file: 'pagination.jsx' },
  { id: 11,  label: '11 — Star Rating',                 file: 'star_rating.jsx' },
  { id: 12,  label: '12 — Image Lazy Loading',          file: 'image_lazy_loading.jsx' },
  { id: 13,  label: '13 — Progress Bar',                file: 'progress_bar.jsx' },
  { id: 14,  label: '14 — Color Picker',                file: 'color_picker.jsx' },
  { id: 15,  label: '15 — Date Picker',                 file: 'date_picker.jsx' },
  { id: 16,  label: '16 — Multi-step Form',             file: 'multi_step_form.jsx' },
  { id: 17,  label: '17 — Kanban Board',                file: 'kanban_board.jsx' },
  { id: 18,  label: '18 — Virtual List',                file: 'virtual_list.jsx' },
  { id: 19,  label: '19 — File Upload Preview',         file: 'file_upload_preview.jsx' },
  { id: 20,  label: '20 — Countdown Timer',             file: 'countdown_timer.jsx' },
  { id: 21,  label: '21 — Stopwatch',                   file: 'stopwatch.jsx' },
  { id: 22,  label: '22 — Carousel',                    file: 'carousel.jsx' },
  { id: 23,  label: '23 — Context API Theme',           file: 'context_api_theme.jsx' },
  { id: 24,  label: '24 — Custom Hooks',                file: 'custom_hooks.jsx' },
  { id: 25,  label: '25 — useReducer Todo',             file: 'use_reducer_todo.jsx' },
  { id: 26,  label: '26 — Memo Optimization',           file: 'memo_optimization.jsx' },
  { id: 27,  label: '27 — useCallback Example',         file: 'use_callback_example.jsx' },
  { id: 28,  label: '28 — useRef Example',              file: 'use_ref_example.jsx' },
  { id: 29,  label: '29 — Forward Ref',                 file: 'forward_ref.jsx' },
  { id: 30,  label: '30 — Portal',                      file: 'portal.jsx' },
  { id: 31,  label: '31 — Error Boundary',              file: 'error_boundary.jsx' },
  { id: 32,  label: '32 — Suspense & Lazy',             file: 'suspense_lazy.jsx' },
  { id: 33,  label: '33 — Higher Order Component',      file: 'higher_order_component.jsx' },
  { id: 34,  label: '34 — Render Props',                file: 'render_props.jsx' },
  { id: 35,  label: '35 — Compound Component',          file: 'compound_component.jsx' },
  { id: 36,  label: '36 — Controlled vs Uncontrolled',  file: 'controlled_vs_uncontrolled.jsx' },
  { id: 37,  label: '37 — Custom Select',               file: 'custom_select.jsx' },
  { id: 38,  label: '38 — Tree View',                   file: 'tree_view.jsx' },
  { id: 39,  label: '39 — Breadcrumb',                  file: 'breadcrumb.jsx' },
  { id: 40,  label: '40 — Side Drawer',                 file: 'side_drawer.jsx' },
  { id: 41,  label: '41 — Tooltip',                     file: 'tooltip.jsx' },
  { id: 42,  label: '42 — Popover',                     file: 'popover.jsx' },
  { id: 43,  label: '43 — Data Table Sort & Filter',    file: 'data_table_sort_filter.jsx' },
  { id: 44,  label: '44 — Chart with Recharts',         file: 'chart_recharts.jsx' },
  { id: 45,  label: '45 — Markdown Editor',             file: 'markdown_editor.jsx' },
  { id: 46,  label: '46 — Code Editor',                 file: 'code_editor.jsx' },
  { id: 47,  label: '47 — Resizable Panels',            file: 'resizable_panels.jsx' },
  { id: 48,  label: '48 — Sticky Header',               file: 'sticky_header.jsx' },
  { id: 49,  label: '49 — Parallax Scroll',             file: 'parallax_scroll.jsx' },
  { id: 50,  label: '50 — Intersection Observer',       file: 'intersection_observer.jsx' },
  { id: 51,  label: '51 — Clipboard Copy',              file: 'clipboard_copy.jsx' },
  { id: 52,  label: '52 — Geolocation',                 file: 'geolocation.jsx' },
  { id: 53,  label: '53 — Browser Storage',             file: 'browser_storage.jsx' },
  { id: 54,  label: '54 — Web Worker',                  file: 'web_worker.jsx' },
  { id: 55,  label: '55 — WebSocket Chat',              file: 'websocket_chat.jsx' },
  { id: 56,  label: '56 — SSE Feed',                    file: 'sse_feed.jsx' },
  { id: 57,  label: '57 — Fetch Abort',                 file: 'fetch_abort.jsx' },
  { id: 58,  label: '58 — Optimistic Update',           file: 'optimistic_update.jsx' },
  { id: 59,  label: '59 — React Query Basic',           file: 'react_query_basic.jsx' },
  { id: 60,  label: '60 — Zustand Counter',             file: 'zustand_counter.jsx' },
  { id: 61,  label: '61 — Redux Toolkit Todo',          file: 'redux_toolkit_todo.jsx' },
  { id: 62,  label: '62 — Immer Reducer',               file: 'immer_reducer.jsx' },
  { id: 63,  label: '63 — Jotai Atoms',                 file: 'jotai_atoms.jsx' },
  { id: 64,  label: '64 — Recoil Basics',               file: 'recoil_basics.jsx' },
  { id: 65,  label: '65 — Framer Motion Animation',     file: 'framer_motion_animation.jsx' },
  { id: 66,  label: '66 — CSS-in-JS',                   file: 'css_in_js.jsx' },
  { id: 67,  label: '67 — Tailwind Components',         file: 'tailwind_components.jsx' },
  { id: 68,  label: '68 — Responsive Grid',             file: 'responsive_grid.jsx' },
  { id: 69,  label: '69 — Dark Mode Toggle',            file: 'dark_mode_toggle.jsx' },
  { id: 70,  label: '70 — i18n Localization',           file: 'i18n_localization.jsx' },
  { id: 71,  label: '71 — Accessibility Focus Trap',    file: 'accessibility_focus_trap.jsx' },
  { id: 72,  label: '72 — Keyboard Navigation',         file: 'keyboard_navigation.jsx' },
  { id: 73,  label: '73 — Form with React Hook Form',   file: 'form_with_react_hook_form.jsx' },
  { id: 74,  label: '74 — Zod Validation',              file: 'zod_validation.jsx' },
  { id: 75,  label: '75 — Password Strength Meter',     file: 'password_strength_meter.jsx' },
  { id: 76,  label: '76 — OTP Input',                   file: 'otp_input.jsx' },
  { id: 77,  label: '77 — Phone Number Input',          file: 'phone_number_input.jsx' },
  { id: 78,  label: '78 — Currency Input',              file: 'currency_input.jsx' },
  { id: 79,  label: '79 — Tag Input',                   file: 'tag_input.jsx' },
  { id: 80,  label: '80 — Mention Input',               file: 'mention_input.jsx' },
  { id: 81,  label: '81 — Rich Text Editor',            file: 'rich_text_editor.jsx' },
  { id: 82,  label: '82 — Image Crop',                  file: 'image_crop.jsx' },
  { id: 83,  label: '83 — Signature Pad',               file: 'signature_pad.jsx' },
  { id: 84,  label: '84 — Barcode Scanner',             file: 'barcode_scanner.jsx' },
  { id: 85,  label: '85 — QR Code Generator',           file: 'qr_code_generator.jsx' },
  { id: 86,  label: '86 — PDF Viewer',                  file: 'pdf_viewer.jsx' },
  { id: 87,  label: '87 — Gantt Chart',                 file: 'gantt_chart.jsx' },
  { id: 88,  label: '88 — Calendar Picker',             file: 'calendar_picker.jsx' },
  { id: 89,  label: '89 — Time Picker',                 file: 'time_picker.jsx' },
  { id: 90,  label: '90 — Range Slider',                file: 'range_slider.jsx' },
  { id: 91,  label: '91 — Audio Player',                file: 'audio_player.jsx' },
  { id: 92,  label: '92 — Video Player',                file: 'video_player.jsx' },
  { id: 93,  label: '93 — Map Integration',             file: 'map_integration.jsx' },
  { id: 94,  label: '94 — Infinite Canvas',             file: 'infinite_canvas.jsx' },
  { id: 95,  label: '95 — Data Visualization',          file: 'data_visualization.jsx' },
  { id: 96,  label: '96 — Network Status',              file: 'network_status.jsx' },
  { id: 97,  label: '97 — Service Worker',              file: 'service_worker.jsx' },
  { id: 98,  label: '98 — Push Notification',           file: 'push_notification.jsx' },
  { id: 99,  label: '99 — PWA Install Prompt',          file: 'pwa_install_prompt.jsx' },
  { id: 100, label: '100 — Performance Profiler',       file: 'performance_profiler.jsx' },

  // ── Date & Time ───────────────────────────────────────────────────────────
  { id: 101, label: '101 — Date Formatter Playground',  file: 'date_formatter.jsx' },
  { id: 102, label: '102 — Relative Time Display',      file: 'relative_time.jsx' },
  { id: 103, label: '103 — Date Range Selector',        file: 'date_range_selector.jsx' },
  { id: 104, label: '104 — Age Calculator',             file: 'age_calculator.jsx' },
  { id: 105, label: '105 — Working Days Counter',       file: 'working_days_counter.jsx' },
  { id: 106, label: '106 — Countdown to Date',          file: 'countdown_to_date.jsx' },

  // ── TanStack Query ────────────────────────────────────────────────────────
  { id: 107, label: '107 — TanStack Query — useQuery',         file: 'tanstack_query_basic.jsx' },
  { id: 108, label: '108 — TanStack Query — useMutation',      file: 'tanstack_query_mutation.jsx' },
  { id: 109, label: '109 — TanStack Query — Paginated',        file: 'tanstack_query_paginated.jsx' },
  { id: 110, label: '110 — TanStack Query — useInfiniteQuery', file: 'tanstack_query_infinite.jsx' },

  // ── Redux Toolkit ─────────────────────────────────────────────────────────
  { id: 111, label: '111 — Redux Toolkit — Counter Slice',  file: 'redux_toolkit_counter.jsx' },
  { id: 112, label: '112 — Redux Toolkit — Shopping Cart',  file: 'redux_toolkit_cart.jsx' },
  { id: 113, label: '113 — Redux Toolkit — Async Thunk',    file: 'redux_toolkit_async_thunk.jsx' },
  { id: 114, label: '114 — RTK Query — createApi',          file: 'rtk_query_fetch.jsx' },

  // ── Common interview problems ─────────────────────────────────────────────
  { id: 115, label: '115 — Infinite Scroll Feed',        file: 'infinite_scroll_feed.jsx' },
].map((p) => ({ ...p, Component: lazyLoad(p.file) }));

export default function App() {
  const [activeId, setActiveId] = useState(PROBLEMS[0].id);
  const active = PROBLEMS.find((p) => p.id === activeId);

  return (
    <div className="playground">
      <aside className="sidebar">
        <h2>Problems</h2>
        {PROBLEMS.map((p) => (
          <button
            key={p.id}
            className={p.id === activeId ? 'active' : ''}
            onClick={() => setActiveId(p.id)}
          >
            {p.label}
          </button>
        ))}
      </aside>

      <main className="main">
        <h1>{active.label}</h1>
        <div className="component-frame">
          <Suspense fallback={<p>Loading...</p>}>
            <active.Component />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
