import {
  Bug,
  Droplets,
  Hammer,
  type LucideIcon,
  Paintbrush,
  Settings,
  Wind,
  Zap,
} from "lucide-react";
import { ServiceCategory } from "../backend";

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  [ServiceCategory.electrician]: "Electrician",
  [ServiceCategory.plumber]: "Plumber",
  [ServiceCategory.acRepair]: "AC Repair",
  [ServiceCategory.carpenter]: "Carpenter",
  [ServiceCategory.painter]: "Painter",
  [ServiceCategory.applianceRepair]: "Appliance Repair",
  [ServiceCategory.pestControl]: "Pest Control",
};

export const CATEGORY_ICONS: Record<ServiceCategory, LucideIcon> = {
  [ServiceCategory.electrician]: Zap,
  [ServiceCategory.plumber]: Droplets,
  [ServiceCategory.acRepair]: Wind,
  [ServiceCategory.carpenter]: Hammer,
  [ServiceCategory.painter]: Paintbrush,
  [ServiceCategory.applianceRepair]: Settings,
  [ServiceCategory.pestControl]: Bug,
};

export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  [ServiceCategory.electrician]:
    "bg-yellow-50 text-yellow-700 border-yellow-200",
  [ServiceCategory.plumber]: "bg-blue-50 text-blue-700 border-blue-200",
  [ServiceCategory.acRepair]: "bg-cyan-50 text-cyan-700 border-cyan-200",
  [ServiceCategory.carpenter]: "bg-amber-50 text-amber-700 border-amber-200",
  [ServiceCategory.painter]: "bg-purple-50 text-purple-700 border-purple-200",
  [ServiceCategory.applianceRepair]: "bg-gray-50 text-gray-700 border-gray-200",
  [ServiceCategory.pestControl]: "bg-green-50 text-green-700 border-green-200",
};

export const ALL_CATEGORIES = Object.values(ServiceCategory);
