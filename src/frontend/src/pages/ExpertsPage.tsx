import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@tanstack/react-router";
import { Search, Users } from "lucide-react";
import { useState } from "react";
import type { ServiceCategory } from "../backend";
import ExpertCard from "../components/ExpertCard";
import { useGetAllExperts } from "../hooks/useQueries";
import {
  ALL_CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from "../lib/categoryConfig";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export default function ExpertsPage() {
  const search = useSearch({ strict: false }) as { category?: ServiceCategory };
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | null>(
    search.category ?? null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allExperts, isLoading } = useGetAllExperts();

  const filtered = (allExperts ?? []).filter((expert) => {
    const matchCat =
      !activeCategory || expert.serviceCategory === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      expert.name.toLowerCase().includes(q) ||
      expert.city.toLowerCase().includes(q) ||
      CATEGORY_LABELS[expert.serviceCategory].toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          Find Service Experts
        </h1>
        <p className="text-muted-foreground">
          Browse our network of verified home service professionals
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, city, or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-ocid="experts.search_input"
        />
      </div>

      {/* Category Filters */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        data-ocid="experts.category.tab"
      >
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
          data-ocid="experts.all.tab"
        >
          All Services
        </Button>
        {ALL_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          return (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="gap-1.5"
              data-ocid={`experts.filter.${cat}.button`}
            >
              <Icon className="w-3.5 h-3.5" />
              {CATEGORY_LABELS[cat]}
            </Button>
          );
        })}
      </div>

      {/* Results */}
      {isLoading ? (
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="experts.loading_state"
        >
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" data-ocid="experts.empty_state">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">
            No experts found
          </h3>
          <p className="text-muted-foreground text-sm">
            {activeCategory
              ? `No ${CATEGORY_LABELS[activeCategory]} experts yet. Try another category.`
              : "No experts available yet."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filtered.length} expert{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((expert, i) => (
              <ExpertCard
                key={expert.owner.toString()}
                expert={expert}
                index={i + 1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
