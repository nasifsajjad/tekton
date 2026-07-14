import { MediaImage } from "./Media";

interface TabData {
  label: string;
  heading: string;
  items: { title: string; body: string }[];
  mediaFile: string;
  mediaExists: boolean;
}

/** Native details preserve the full interaction without hydration overhead. */
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
          <div className="mt-6 divide-y divide-white/15 border-y border-white/15">
            {tab.items.map((item, index) => (
              <details key={item.title} open={index === 0} className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {item.title}<span aria-hidden="true" className="text-forge transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-gray-on-dark-2">{item.body}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
