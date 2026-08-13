import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props
});

export const PlayIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none" />
  </svg>
);

export const StopIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" stroke="none" />
  </svg>
);

export const BroomIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 4 9 15" />
    <path d="M9 15 3 21l3-8 3 3z" />
    <path d="M13 4 20 11" />
  </svg>
);

export const RestartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <polyline points="3 3 3 9 9 9" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const CopyIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const ArrowUpIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

export const ArrowDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const UploadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const MarkdownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M6 15V9l3 3 3-3v6" />
    <path d="M16 9v6" />
    <path d="M13.5 12.5 16 15l2.5-2.5" />
  </svg>
);

export const CodeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const NewFileIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

export const ZapIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none" />
  </svg>
);

export const EditIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const AlertIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const LogoMark = (p: SVGProps<SVGSVGElement>) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" {...p}>
    <rect width="32" height="32" rx="4" fill="#08090b" />
    <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" stroke="#7c8891" strokeOpacity="0.35" />
    <path
      d="M11 10.5c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v2.2h-5.2v1h7.2c1.1 0 2 .9 2 2V21c0 1.1-.9 2-2 2h-3v-2.2h-2v-3h5.2v-1H12c-1.1 0-2-.9-2-2v-3.3Z"
      fill="#e6e3da"
    />
    <circle cx="13.1" cy="9.6" r="0.9" fill="#7c8891" />
    <circle cx="18.9" cy="22.4" r="0.9" fill="#7c8891" />
  </svg>
);

/* ── Notebook / Previewer mode icons ─────────────────────────────── */

export const NotebookModeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="13" y2="15" />
  </svg>
);

export const PreviewerModeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 19V6a2 2 0 0 1 2-2h9l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <path d="M15 4v4a1 1 0 0 0 1 1h4" />
    <path d="M8 14.5v-4l2 2 2-2v4" />
  </svg>
);

/* ── WYSIWYG formatting toolbar icons ────────────────────────────── */

export const BoldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 4h7a3.5 3.5 0 0 1 0 7H6z" />
    <path d="M6 11h8a3.5 3.5 0 0 1 0 7H6z" />
  </svg>
);

export const ItalicIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <line x1="12" y1="4" x2="9" y2="20" />
    <line x1="15" y1="4" x2="10.6" y2="4" />
    <line x1="13.4" y1="20" x2="9" y2="20" />
  </svg>
);

export const StrikeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <path d="M16.5 7.5c-.6-1.4-2-2.3-4-2.3-2.4 0-4 1.2-4 3 0 1.6 1.2 2.3 3 2.8" />
    <path d="M7.5 16.2c.5 1.5 2.1 2.6 4.3 2.6 2.4 0 4.2-1.1 4.2-3 0-1-.5-1.7-1.5-2.2" />
  </svg>
);

export const Heading1Icon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5v14" />
    <path d="M12 5v14" />
    <path d="M4 12h8" />
    <path d="M17 9.5 20 8v8" />
  </svg>
);

export const Heading2Icon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5v14" />
    <path d="M12 5v14" />
    <path d="M4 12h8" />
    <path d="M16.5 9.8a2.3 2.3 0 0 1 4.5.7c0 1.6-2 2.4-4.3 4.9h4.5" />
  </svg>
);

export const Heading3Icon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5v14" />
    <path d="M12 5v14" />
    <path d="M4 12h8" />
    <path d="M16.6 9.2a2.2 2.2 0 0 1 4 1.4c0 1.1-.9 1.6-1.5 1.8.7.2 1.7.8 1.7 2 0 1.6-1.7 2.4-3.9 1.7" />
  </svg>
);

export const ParagraphIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 4v16" />
    <path d="M17 4v16" />
    <path d="M13 4h-2.5a3.5 3.5 0 1 0 0 7H13" />
  </svg>
);

export const QuoteIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 8c-1.7.9-2.7 2.4-2.7 4.3 0 1.8 1.2 3 2.7 3 1.6 0 2.7-1.2 2.7-2.7 0-1.4-1-2.5-2.4-2.6.2-1.3 1.1-2.4 2.4-3z" />
    <path d="M16 8c-1.7.9-2.7 2.4-2.7 4.3 0 1.8 1.2 3 2.7 3 1.6 0 2.7-1.2 2.7-2.7 0-1.4-1-2.5-2.4-2.6.2-1.3 1.1-2.4 2.4-3z" />
  </svg>
);

export const InlineCodeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <polyline points="9 8 5 12 9 16" />
    <polyline points="15 8 19 12 15 16" />
  </svg>
);

export const CodeBlockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <polyline points="9 9.5 6.5 12 9 14.5" />
    <polyline points="15 9.5 17.5 12 15 14.5" />
  </svg>
);

export const BulletListIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="5" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="5" cy="18" r="1.2" fill="currentColor" stroke="none" />
    <line x1="9.5" y1="6" x2="20" y2="6" />
    <line x1="9.5" y1="12" x2="20" y2="12" />
    <line x1="9.5" y1="18" x2="20" y2="18" />
  </svg>
);

export const OrderedListIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <line x1="9.5" y1="6" x2="20" y2="6" />
    <line x1="9.5" y1="12" x2="20" y2="12" />
    <line x1="9.5" y1="18" x2="20" y2="18" />
    <text x="2.5" y="8.5" fontSize="7" fill="currentColor" stroke="none" fontFamily="monospace">1</text>
    <text x="2.5" y="14.5" fontSize="7" fill="currentColor" stroke="none" fontFamily="monospace">2</text>
    <text x="2.5" y="20.5" fontSize="7" fill="currentColor" stroke="none" fontFamily="monospace">3</text>
  </svg>
);

export const TaskListIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="4" width="6" height="6" rx="1.2" />
    <polyline points="5 7 6.2 8.2 8 6" />
    <rect x="3.5" y="14" width="6" height="6" rx="1.2" />
    <line x1="12.5" y1="7" x2="20.5" y2="7" />
    <line x1="12.5" y1="17" x2="20.5" y2="17" />
  </svg>
);

export const LinkIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 15 15 9" />
    <path d="M11 6.5 12.4 5A4 4 0 1 1 18 10.6L16.5 12" />
    <path d="M13 17.5 11.6 19A4 4 0 1 1 6 13.4L7.5 12" />
  </svg>
);

export const ImageIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4.5 18 10 12.5l3 3 2.5-2.5L20.5 18" />
  </svg>
);

export const TableIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="3" y1="16" x2="21" y2="16" />
    <line x1="11" y1="4" x2="11" y2="20" />
  </svg>
);

export const HrIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

export const UndoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 10h10a5 5 0 0 1 0 10H10" />
    <polyline points="8 6 4 10 8 14" />
  </svg>
);

export const RedoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 10H10a5 5 0 0 0 0 10h4" />
    <polyline points="16 6 20 10 16 14" />
  </svg>
);

export const ClearFormatIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 4h13" />
    <path d="M10 4 8 20" />
    <path d="M4 20h9" />
    <line x1="15.5" y1="15.5" x2="20.5" y2="20.5" />
    <line x1="20.5" y1="15.5" x2="15.5" y2="20.5" />
  </svg>
);

export const FileTextIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);
