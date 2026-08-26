import AccordionColumn from "./AccordionColumn";

interface TabData {
  label: string;
  heading: string;
  items: { title: string; body: string }[];
}

/**
 * Renders the three supply-line columns. The interactive list in each column
 * is the AccordionColumn client component.
 */
export default function SupplyLineTabs({ tabs }: { tabs: TabData[] }) {
  return (
    <div className="grid gap-12 lg:grid-cols-3">
      {tabs.map((tab) => (
        <section key={tab.label} className="border-t-2 border-forge pt-6">
          <p className="eyebrow text-forge">{tab.label}</p>
          <h3 className="display mt-3 min-h-[2.1em] text-header-xs text-white">{tab.heading}</h3>
          <AccordionColumn items={tab.items} />
        </section>
      ))}
    </div>
  );
}
