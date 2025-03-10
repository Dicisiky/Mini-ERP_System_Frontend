import {
  FileIcon,
  User2Icon,
  EyeIcon,
  PlusIcon,
  BoxIcon,
  FolderOpenIcon,
  PercentIcon,
  BadgeEuroIcon,
  TruckIcon,
  PackageOpenIcon,
  CircleAlertIcon,
  BriefcaseBusinessIcon,
  Grid2X2Icon,
  Layers2Icon,
  LogsIcon,
  HomeIcon,
  ChartBarIcon,
  FolderKeyIcon,
  ListIcon,
  Gavel,
} from "lucide-react";

const sidebarItems = [
  {
    groupTitle: "Overview",
    icon: Grid2X2Icon,
    items: [
      {
        title: "Stock",
        icon: Layers2Icon,
        links: [
          { text: "Stock", path: "stock", icon: EyeIcon },
        ],
      },
    ],
  },
  {
    groupTitle: "Commerce",
    icon: BadgeEuroIcon,
    items: [
      {
        title: "Sales orders",
        icon: TruckIcon,
        links: [
          { text: "All orders", path: "sales-orders/all", icon: EyeIcon },
          { text: "New order", path: "sales-orders/new", icon: PlusIcon },
          {
            text: "All order lines",
            path: "sales-order-lines/all",
            icon: ListIcon,
          },
          {
            text: "New order line",
            path: "sales-order-lines/new",
            icon: PlusIcon,
          },
        ],
      },

      {
        title: "Rent orders",
        icon: FolderKeyIcon,
        links: [
          { text: "All orders", path: "rents/all", icon: EyeIcon },
          { text: "New order", path: "rents/new", icon: PlusIcon },
          { text: "Rent lines", path: "rent-lines/all", icon: ListIcon },
          { text: "New rent line", path: "rent-lines/new", icon: PlusIcon },
          {
            text: "Applied penalties",
            path: "applied-penalties/all",
            icon: Gavel,
          },
          {
            text: "Apply penalty",
            path: "applied-penalties/new",
            icon: PlusIcon,
          },
        ],
      },

      {
        title: "Purchase orders",
        icon: PackageOpenIcon,
        links: [
          { text: "All orders", path: "purchase-orders/all", icon: EyeIcon },
          { text: "New order", path: "purchase-orders/new", icon: PlusIcon },
          {
            text: "All order lines",
            path: "purchase-order-lines/all",
            icon: ListIcon,
          },
          {
            text: "New order line",
            path: "purchase-order-lines/new",
            icon: PlusIcon,
          },
        ],
      },

      {
        title: "Projects",
        icon: BriefcaseBusinessIcon,
        links: [
          { text: "All projects", path: "projects/all", icon: EyeIcon },
          { text: "New project", path: "projects/new", icon: PlusIcon },
        ],
      },
    ],
  },

  {
    groupTitle: "Reference Data",
    icon: FileIcon,
    items: [
      {
        title: "Relations",
        icon: User2Icon,
        links: [
          { text: "All relations", path: "relations/all", icon: EyeIcon },
          { text: "Add relation", path: "relations/new", icon: PlusIcon },
        ],
      },
      {
        title: "Articles",
        icon: BoxIcon,
        links: [
          { text: "All articles", path: "articles/all", icon: EyeIcon },
          { text: "Add article", path: "articles/new", icon: PlusIcon },
        ],
      },
      {
        title: "Article categories",
        icon: FolderOpenIcon,
        links: [
          { text: "All categories", path: "categories/all", icon: EyeIcon },
          { text: "Add category", path: "categories/new", icon: PlusIcon },
        ],
      },
      {
        title: "VAT rates",
        icon: PercentIcon,
        links: [
          { text: "All VAT Rates", path: "vat-rates/all", icon: EyeIcon },
          { text: "Add VAT Rate", path: "vat-rates/new", icon: PlusIcon },
        ],
      },
      {
        title: "Penalties",
        icon: CircleAlertIcon,
        links: [
          { text: "All penalties", path: "penalties/all", icon: EyeIcon },
          { text: "Add penalty", path: "penalties/new", icon: PlusIcon },
        ],
      },
    ],
  },
];

export default sidebarItems;
