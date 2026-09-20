// Demo seed data for the Life Coach Website.
//
// Used ONLY on `/demo/*` routes via SeedDataProvider. Arrays carry raw,
// filterable fields (dates, statuses, display_order) so the SeedDataProvider can
// apply the SAME filters the SupabaseDataProvider applies in-memory. Shapes
// mirror the Supabase table schemas from the cloudboard exactly.
//
// Only `src/lib/data-provider.tsx` may import this file.

// ─────────────────────────────────────────────────────────────────────────────
// Table row types — mirror the cloudboard schema
// ─────────────────────────────────────────────────────────────────────────────

export type ProgramIcon =
  | "Briefcase"
  | "RefreshCw"
  | "Star"
  | (string & {});

export interface Program {
  id: string;
  name: string;
  icon: string;
  who_its_for: string;
  /**
   * "What we cover" bullets. Stored in Postgres as a single `text` column
   * (one item per line); represented here and across the app as a string[].
   * The SupabaseDataProvider splits/joins on newlines at the boundary.
   */
  description: string[];
  duration_label: string;
  is_active: boolean;
  display_order: number;
}

export interface AvailabilityRow {
  id?: string;
  day_of_week: number; // 0 = Sunday … 6 = Saturday
  start_time: string | null; // "HH:mm"
  end_time: string | null; // "HH:mm"
  is_available: boolean;
}

export interface DateOverride {
  id: string;
  override_date: string; // ISO date "YYYY-MM-DD"
  reason: string | null;
}

export interface Profile {
  id: string;
  full_name: string;
  booking_buffer_hours: number;
}

export type BookingStatus = "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  focus_area: string;
  goals: string;
  program_interest_id: string | null;
  booking_date: string; // ISO date "YYYY-MM-DD"
  booking_time: string; // "HH:mm"
  status: BookingStatus;
  cancellation_note: string | null;
  created_at: string; // ISO timestamp
}

export type InquiryType =
  | "General Question"
  | "Press / Media"
  | "Collaboration"
  | "Other";

export type MessageStatus = "new" | "read" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  inquiry_type: InquiryType;
  message: string;
  status: MessageStatus;
  created_at: string; // ISO timestamp
}

// ─────────────────────────────────────────────────────────────────────────────
// Static marketing content types (public pages — not filtered)
// ─────────────────────────────────────────────────────────────────────────────

export interface EditorialBandContent {
  overline: string;
  heading: string;
  body: string;
  subLinks?: { label: string; href: string }[];
  cta?: string;
  image: string;
}

export interface OutcomeBandContent {
  overline: string;
  quote: string;
  attribution: string;
  image: string;
}

export interface ConsultationBandContent {
  overline: string;
  heading: string;
  bullets: string[];
  image: string;
}

export interface CoachStory {
  story_p1: string;
  story_p2: string;
}

export interface ApproachColumn {
  title: string;
  body: string;
}

export interface Credential {
  icon: string;
  text: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface CoachBioSnippet {
  short_bio: string;
  credentials_inline: string;
}

export interface ProgramsOutcomeBand {
  overline: string;
  line: string;
  image: string;
}

export interface ValuePanelItem {
  icon: string;
  label: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Filterable table data
// ─────────────────────────────────────────────────────────────────────────────

export const programs: Program[] = [
  {
    id: "prog_1",
    name: "Career Clarity",
    icon: "Briefcase",
    who_its_for:
      "For professionals who've outgrown their current path but can't see what comes next.",
    description: [
      "Values alignment & what you actually want from your work life",
      "Identifying what's been holding you back",
      "Building a concrete plan for what comes next",
    ],
    duration_label: "12 weeks",
    is_active: true,
    display_order: 1,
  },
  {
    id: "prog_2",
    name: "Life Transitions",
    icon: "RefreshCw",
    who_its_for:
      "For anyone at a major crossroads — divorce, career change, relocation, grief.",
    description: [
      "Making sense of where you are and how you got here",
      "Identifying what you want the next chapter to look like",
      "Building forward momentum without rushing the process",
    ],
    duration_label: "8 weeks",
    is_active: true,
    display_order: 2,
  },
  {
    id: "prog_3",
    name: "Confidence & Leadership",
    icon: "Star",
    who_its_for: "For people who know what they want but struggle to own it.",
    description: [
      "Understanding what's behind the self-doubt",
      "Learning to advocate for yourself without performing",
      "Showing up differently in the rooms that matter",
    ],
    duration_label: "10 weeks",
    is_active: true,
    display_order: 3,
  },
];

export const activePrograms: Program[] = programs.filter((p) => p.is_active);

export const availability: AvailabilityRow[] = [
  { day_of_week: 0, is_available: false, start_time: null, end_time: null }, // Sun
  { day_of_week: 1, is_available: true, start_time: "09:00", end_time: "17:00" }, // Mon
  { day_of_week: 2, is_available: true, start_time: "09:00", end_time: "17:00" }, // Tue
  { day_of_week: 3, is_available: false, start_time: null, end_time: null }, // Wed
  { day_of_week: 4, is_available: true, start_time: "09:00", end_time: "17:00" }, // Thu
  { day_of_week: 5, is_available: true, start_time: "09:00", end_time: "15:00" }, // Fri
  { day_of_week: 6, is_available: false, start_time: null, end_time: null }, // Sat
];

export const dateOverrides: DateOverride[] = [
  { id: "do_1", override_date: "2025-04-22", reason: "Holiday" },
];

export const profile: Profile = {
  id: "demo-coach",
  full_name: "ACME",
  booking_buffer_hours: 24,
};

export const bookings: Booking[] = [
  {
    id: "bk_1",
    client_name: "Jamie Okafor",
    client_email: "jamie@example.com",
    client_phone: "+1 (415) 555-0192",
    focus_area: "Career & Work",
    goals:
      "I've been in the same role for 6 years and I feel completely stuck. I don't hate my job but I don't love it either and I can't figure out what I actually want to be doing…",
    program_interest_id: "prog_1",
    booking_date: "2025-04-25",
    booking_time: "15:00",
    status: "confirmed",
    cancellation_note: null,
    created_at: "2025-04-18T09:00:00Z",
  },
  {
    id: "bk_2",
    client_name: "Priya Nair",
    client_email: "priya@example.com",
    client_phone: null,
    focus_area: "Major Life Transition",
    goals:
      "I'm going through a divorce and struggling to figure out what comes next…",
    program_interest_id: "prog_2",
    booking_date: "2025-04-28",
    booking_time: "10:00",
    status: "confirmed",
    cancellation_note: null,
    created_at: "2025-04-20T11:30:00Z",
  },
  {
    id: "bk_3",
    client_name: "Marcus Torres",
    client_email: "marcus.t@example.com",
    client_phone: "+1 (312) 555-0847",
    focus_area: "Confidence & Self-Worth",
    goals:
      "I keep getting passed over for leadership roles and I don't know why…",
    program_interest_id: "prog_3",
    booking_date: "2025-05-02",
    booking_time: "09:00",
    status: "confirmed",
    cancellation_note: null,
    created_at: "2025-04-21T14:00:00Z",
  },
  {
    id: "bk_4",
    client_name: "Elena Rios",
    client_email: "elena@example.com",
    client_phone: null,
    focus_area: "Relationships & Family",
    goals: "My relationship with my teenage son has completely broken down…",
    program_interest_id: null,
    booking_date: "2025-04-10",
    booking_time: "11:00",
    status: "completed",
    cancellation_note: null,
    created_at: "2025-04-05T08:00:00Z",
  },
];

export const contactMessages: ContactMessage[] = [
  {
    id: "msg_1",
    name: "Priya Nair",
    email: "priya@example.com",
    subject: "Question before I book",
    inquiry_type: "General Question",
    message:
      "Hi there, I've been reading your site and I'm interested but I've never worked with a coach before. How do I know if I'm ready?",
    status: "new",
    created_at: "2025-04-18T10:30:00Z",
  },
  {
    id: "msg_2",
    name: "Dan Whitfield",
    email: "dan.w@example.com",
    subject: "Podcast collaboration",
    inquiry_type: "Collaboration",
    message:
      "Hi there, I host a podcast about career change and I'd love to have you on as a guest.",
    status: "read",
    created_at: "2025-04-12T14:15:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Static marketing content — not filtered, used directly by public pages
// ─────────────────────────────────────────────────────────────────────────────

export const editorialBands: EditorialBandContent[] = [
  {
    overline: "My Approach",
    heading: "Stuck isn't a personality trait",
    body: "Most of my clients arrive with a solution when they haven't yet understood the real problem. We slow down before we speed up.",
    subLinks: [
      { label: "Start where you are", href: "/about" },
      { label: "Name what's stuck", href: "/about" },
    ],
    image: "approach.jpg",
  },
  {
    overline: "Working Together",
    heading: "What a plan that fits looks like",
    body: "A free intake → an honest read on fit → a plan built around your life, not a template.",
    cta: "Book a free intake call",
    image: "together.jpg",
  },
];

export const outcomeBand: OutcomeBandContent = {
  overline: "How it feels",
  quote:
    "Within three months I left a job that was making me miserable and started something I actually care about.",
  attribution: "Marcus T., Career Clarity client",
  image: "outcome.jpg",
};

export const consultationBand: ConsultationBandContent = {
  overline: "Ready to talk?",
  heading: "Book your free intake call",
  bullets: [
    "A real conversation, no script",
    "An honest read on whether we fit",
    "A recommended next step",
    "30 minutes, free",
  ],
  image: "consult.jpg",
};

export const coachStory: CoachStory = {
  story_p1:
    "I didn't become a coach because everything went right for me. I became a coach because I spent years getting it wrong — the prestigious jobs, the external markers of success that felt hollow on a Tuesday morning.",
  story_p2:
    "After a career in finance and a decade of looking successful on paper, I found a coach who asked me the questions nobody else was asking. It changed everything. I trained at the Co-Active Training Institute, earned my ICF certification, and have spent the last seven years doing for others what that coach did for me.",
};

export const approachColumns: ApproachColumn[] = [
  {
    title: "DISCOVER",
    body: "We slow down first. Most of my clients arrive with a solution when they haven't yet understood the real problem.",
  },
  {
    title: "CHALLENGE",
    body: "I won't tell you what to do. I'll ask you the questions that help you find the answer that's already in you.",
  },
  {
    title: "MOVE",
    body: "Insight without action is just interesting. We build in concrete next steps every session — small, real, yours.",
  },
];

export const credentials: Credential[] = [
  { icon: "Award", text: "ICF Certified Professional Coach (PCC)" },
  { icon: "BookOpen", text: "Trained at the Co-Active Training Institute" },
  { icon: "Users", text: "200+ clients coached since 2018" },
  { icon: "Clock", text: "7 years in practice" },
];

export const faqs: Faq[] = [
  {
    question: "How does coaching actually work?",
    answer:
      "We meet one-on-one via video, once a week or every two weeks. Each session is 50 minutes. I ask questions, you think out loud, and together we figure out what's next.",
  },
  {
    question: "How long are the programs?",
    answer:
      "Programs run 8–12 weeks depending on the focus area. The intake call helps us agree on the right fit before you commit to anything.",
  },
  {
    question: "Is the intake call really free?",
    answer:
      "Yes — completely. No credit card, no obligation. It's a real conversation to see if working together makes sense for both of us.",
  },
  {
    question: "What happens if we're not a fit?",
    answer:
      "I'll tell you honestly and, where I can, point you toward something that might help more. Finding the right support matters more than filling a spot.",
  },
  {
    question: "How do we meet — video or in person?",
    answer:
      "All sessions are via video call (Zoom or Google Meet). This means we can work together regardless of where you're based.",
  },
];

export const coachBioSnippet: CoachBioSnippet = {
  short_bio:
    "I spent 12 years climbing the wrong ladder before I understood what I wanted.",
  credentials_inline: "ICF Certified · Co-Active Training · 7 years",
};

export const programsOutcomeBand: ProgramsOutcomeBand = {
  overline: "How you'll feel",
  line: "Clearer, calmer, and finally moving in a direction that's mine.",
  image: "outcome-programs.jpg",
};

export const valuePanelItems: ValuePanelItem[] = [
  {
    icon: "MessageCircle",
    label: "A real conversation",
    description: "About what you're working through — no script, no sales pitch",
  },
  {
    icon: "CheckCircle",
    label: "An honest read on fit",
    description: "And if we're not a fit, where to look instead",
  },
  {
    icon: "Compass",
    label: "A recommended next step",
    description: "The program that fits, if there is one",
  },
  { icon: "Clock", label: "30 minutes, free", description: "Zero pressure" },
];

// Static option lists (used by forms — not persisted rows)
export const focusAreas = [
  "Career & Work",
  "Relationships & Family",
  "Confidence & Self-Worth",
  "Major Life Transition",
  "Other",
] as const;

export const inquiryTypes: InquiryType[] = [
  "General Question",
  "Press / Media",
  "Collaboration",
  "Other",
];
