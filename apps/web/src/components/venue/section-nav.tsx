import { cn } from "#/lib/utils";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "courts", label: "Courts" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "rules", label: "Rules" },
];

export function SectionNav() {
  return (
    <nav className="sticky top-16 z-40 -mx-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:-mx-0 sm:px-0">
      <div className="flex gap-6 overflow-x-auto">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "shrink-0 border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            )}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
