import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "DATA ANALYTICS",
    items: [
      {
        title: "Data Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "MRV Overview",
            url: "/",
          },
        ],
      },
      {
        title: "Data Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "User Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Data Entry",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Monitoring Forms",
            url: "/forms/form-elements",
          },
          {
            title: "Data Collection",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Data Tables",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: "MRV Data Tables",
            url: "/tables",
          },
        ],
      },
      {
        title: "System",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Platform Settings",
            url: "/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "REPORTING & VERIFICATION",
    items: [
      {
        title: "Analytics Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Data Visualization",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "Interface Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "System Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Action Controls",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Access Control",
        icon: Icons.Authentication,
        items: [
          {
            title: "Platform Login",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
