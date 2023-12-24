import duotone from "components/icons/duotone";

export const navigations = [
  { type: "label", label: "Admin" },
  { name: "Dashboard", icon: duotone.Dashboard, path: "/" },

  {
    name: "School Management",
    icon: duotone.Products,
    children: [
      { name: "All Schools", path: "/admin/schools" },
      { name: "Create School", path: "/admin/schools/add-school" },
    ],
  },

  {
    name: "User Management",
    icon: duotone.Accounts,
    children: [
      // { name: "Add User", path: "/users/add" }, // Changed to /admin/users/add
      { name: "All Users", path: "/users" }, // Changed to /admin/users
    ],
  },

  {
    name: "Feed Management",
    icon: duotone.Apps,
    children: [
      { name: "All Feeds", path: "/feeds" }, // Changed to /admin/feeds
      // { name: "Create Feed", path: "/feeds/create" }, // Changed to /admin/feeds/create
    ],
  },

  {
    name: "Mentor Management",
    icon: duotone.Customers,
    children: [
      { name: "All Mentors", path: "/mentors" }, // Changed to /admin/mentors
      { name: "Add Mentor", path: "/mentors/add-mentor" }, // Changed to /admin/mentors/add
    ],
  },
  {
    name: "Microcredentials",
    icon: duotone.Dashboard,
    path: "/microcredentials",
  },

  {
    name: "Subscription Management",
    icon: duotone.AccountSetting,
    path: "/subscription", // Changed to /admin/subscriptions
  },
  {
    name: "FAQ Management",
    icon: duotone.AccountSetting,
    path: "/faq", // Changed to /admin/faqs
  },
  {
    name: "CMS Management",
    icon: duotone.AccountSetting,
    path: "/cms",
  },
  { name: "All Pages", icon: duotone.Dashboard, path: "/cms/all-pages" },

  {
    name: "Push Notifications",
    icon: duotone.Notification,
    path: "/notifications",
  },
];
