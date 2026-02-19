import type { Opportunity, Plan } from "./types";

export const PLAN_PRICING: Record<Plan, { price: string; highlights: string[] }> = {
  basic: {
    price: "N0 / month",
    highlights: [
      "Timetable + announcements",
      "5 resource downloads/day",
      "1 AI summary/day",
      "1 GB offline storage",
    ],
  },
  premium: {
    price: "N500 - N1,000 / month",
    highlights: [
      "Unlimited summaries + streams",
      "Advanced AI matching",
      "Priority support",
      "5 GB offline storage",
    ],
  },
  enterprise: {
    price: "N100,000 - N500,000 / year",
    highlights: [
      "Bulk user management",
      "Custom integrations + SLAs",
      "University white-labeling",
      "Advanced analytics",
    ],
  },
};

export const MVP_STATS = [
  { label: "Universities Targeted", value: "12+" },
  { label: "Simulated Missed-Class Reduction", value: "30%" },
  { label: "Dropout-Risk Support Coverage", value: "24/7" },
  { label: "Offline First Storage", value: "Up to 5 GB" },
];

export const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "UNILAG Micro Scholarship for STEM Students",
    type: "scholarship",
    organization: "Lagos EduFund",
    description:
      "Monthly micro-grant for students in engineering and computer science with strong project portfolios.",
    amount: 120000,
    currency: "NGN",
    deadline: "2026-03-12",
    requirements: ["STEM student", "portfolio", "minimum CGPA 3.2/5"],
    skills: ["python", "data analysis", "research writing"],
    location: "Lagos",
    isRemote: true,
    applicationUrl: "https://example.org/unilag-stem-grant",
    tags: ["unilag", "stem", "grant", "micro-scholarship"],
    createdAt: "2026-01-05",
  },
  {
    id: "opp-2",
    title: "Campus Tutor Gig - Economics 101",
    type: "gig",
    organization: "PeerLift NG",
    description:
      "Part-time tutoring for 100-level economics students. Weekly payment and flexible evening schedule.",
    amount: 30000,
    currency: "NGN",
    deadline: "2026-03-02",
    requirements: ["teaching ability", "economics basics", "communication"],
    skills: ["teaching", "economics", "communication"],
    location: "Lagos",
    isRemote: false,
    applicationUrl: "https://example.org/peerlift-econ-tutor",
    tags: ["tutoring", "gig", "economics"],
    createdAt: "2026-01-12",
  },
  {
    id: "opp-3",
    title: "Remote Frontend Internship (Student Friendly)",
    type: "internship",
    organization: "Andela Talent Labs",
    description:
      "Remote internship for students with React and TypeScript knowledge. Includes mentorship and stipend.",
    amount: 150000,
    currency: "NGN",
    deadline: "2026-03-18",
    requirements: ["portfolio", "react basics", "git workflow"],
    skills: ["react", "typescript", "git", "ui design"],
    location: "Remote",
    isRemote: true,
    applicationUrl: "https://example.org/andela-frontend-internship",
    tags: ["internship", "remote", "frontend"],
    createdAt: "2026-01-20",
  },
  {
    id: "opp-4",
    title: "Research Assistant Bursary - Social Sciences",
    type: "bursary",
    organization: "EduBridge NGO",
    description:
      "Research support bursary for students working on community development and public policy projects.",
    amount: 90000,
    currency: "NGN",
    deadline: "2026-03-28",
    requirements: ["proposal", "community project", "report writing"],
    skills: ["research writing", "statistics", "project planning"],
    location: "Ibadan",
    isRemote: true,
    applicationUrl: "https://example.org/edubridge-bursary",
    tags: ["bursary", "social science", "research"],
    createdAt: "2026-02-01",
  },
  {
    id: "opp-5",
    title: "Freelance Graphics Design Gig for Student Clubs",
    type: "gig",
    organization: "Campus Creators Hub",
    description:
      "Design social media flyers and event banners for university clubs and departments.",
    amount: 45000,
    currency: "NGN",
    deadline: "2026-03-10",
    requirements: ["portfolio", "deadline management"],
    skills: ["figma", "graphic design", "branding"],
    location: "Abuja",
    isRemote: true,
    applicationUrl: "https://example.org/campus-creators-design",
    tags: ["design", "gig", "creative"],
    createdAt: "2026-02-03",
  },
];
