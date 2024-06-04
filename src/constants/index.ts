import { Archive, Flag, Github, Settings, Users } from "lucide-react";

const NAV_LINKS = [
  {
    name: "About",
  },
  {
    name: "Careers",
  },
  {
    name: "History",
  },
  {
    name: "Services",
  },
  {
    name: "Projects",
  },
];

const MENU_BOTTOM = [
  {
    name: "Getting Started",
    icon: Flag,
  },
  {
    id: 2,
    name: "Github",
    icon: Github,
  },
  {
    id: 3,
    name: "Archive",
    icon: Archive,
  },
];

const MENU_TOP = [
  {
    name: "Create Team",
    path: "/teams/create",
    icon: Users,
  },
  {
    id: 2,
    name: "Settings",
    icon: Settings,
    path: "",
  },
];


const WORKSPACE_TABS = [
  {
    name: "Document",
    value: "document",
  },
  {
    name: "Both",
    value: "both",
  },
  {
    name: "Canvas",
    value: "canvas",
  },
];
const MAX_FREE_FILE = 5;

const FOOTER_LINKS = [
  {
    title: "Services",
    links: [
      {
        label: "1on1 Coaching",
        href: "#",
      },
      {
        label: "Company Review",
        href: "#",
      },
      {
        label: "Accounts Review",
        href: "#",
      },
      {
        label: "HR Consulting",
        href: "#",
      },
      {
        label: "SEO Optimisation",
        href: "#",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        label: "About",
        href: "#",
      },
      {
        label: "Meet the Team",
        href: "#",
      },
      {
        label: "Accounts Review",
        href: "#",
      },
    ],
  },
  {
    title: "Helpful Links",
    links: [
      {
        label: "Contact",
        href: "#",
      },
      {
        label: "FAQs",
        href: "#",
      },
      {
        label: "Live Chat",
        href: "#",
      },
    ],
  },
];

const FILES_TABLE_TITLE = [" File Name", " Created At", "Edited", "Author"];
export { NAV_LINKS, MENU_BOTTOM, MENU_TOP, MAX_FREE_FILE ,FILES_TABLE_TITLE,WORKSPACE_TABS,FOOTER_LINKS};
