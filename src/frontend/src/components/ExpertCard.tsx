import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import type { Expert } from "../backend";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from "../lib/categoryConfig";

interface ExpertCardProps {
  expert: Expert;
  index: number;
}

export default function ExpertCard({ expert, index }: ExpertCardProps) {
  const principalId = expert.owner.toString();
  const Icon = CATEGORY_ICONS[expert.serviceCategory];
  const colorClass = CATEGORY_COLORS[expert.serviceCategory];
  const label = CATEGORY_LABELS[expert.serviceCategory];
  const initials = expert.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="shadow-card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border-border"
      data-ocid={`experts.item.${index}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-primary text-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-base text-foreground truncate">
                {expert.name}
              </h3>
              <span
                className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5"
                data-ocid={`experts.verified.${index}`}
              >
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            </div>
            <Badge
              variant="outline"
              className={`mt-1 text-xs font-medium border ${colorClass} flex-shrink-0 inline-flex items-center gap-1`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </Badge>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{expert.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{Number(expert.yearsOfExperience)} yrs experience</span>
          </div>
        </div>

        {expert.bio && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {expert.bio}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 gap-1.5"
            data-ocid={`experts.call.button.${index}`}
          >
            <a href={`tel:${expert.phoneNumber}`}>
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1"
            data-ocid={`experts.view.button.${index}`}
          >
            <Link to="/experts/$principalId" params={{ principalId }}>
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
