import AccordionColumn from "./AccordionColumn";
import { MediaImage } from "./Media";

interface TabData {
  label: string;
  heading: string;
  items: { title: string; body: string }[];
  mediaFile: string;
  mediaExists: boolean;
}

/**
 * Server component: renders the three supply-line columns (media slots read
 * the filesystem, so this must stay server-side). The interactive accordion
 * list in each column is the AccordionColumn client component.
 */
export default function SupplyLineTabs({ tabs }: { tabs: TabData[] }) {
  return (
    <div className="grid gap-12 lg:grid-cols-3">
      {tabs.map((tab) => (
        <section key={tab.label} className="border-t-2 border-forge pt-6">
          <p className="eyebrow text-forge">{tab.label}</p>
          <h3 className="display mt-3 min-h-[2.1em] text-header-xs text-white">{tab.heading}</h3>
          <div className="mt-6 overflow-hidden">
            <MediaImage file={tab.mediaFile} alt={`${tab.label} — ${tab.heading}`} aspect="16/10" />
          </div>
          <AccordionColumn items={tab.items} />
        </section>
      ))}
    </div>
  );
}
