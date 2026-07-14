"use client";

import { useRef } from "react";

// Matches the site-wide motion system (see globals.css motion system comment).
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 350;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One column's exclusive, animated accordion list. Uses refs (not state) so
 * the component never re-renders after mount — that keeps React from fighting
 * the imperative `open` attribute toggles performed during animation. Kept
 * free of server-only imports so the parent section can stay a server
 * component (MediaImage reads the filesystem and must not enter this bundle).
 */
export default function AccordionColumn({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const openIndexRef = useRef(0);
  const animatingRef = useRef(false);

  const closeItem = (index: number, onDone: () => void) => {
    const details = detailsRefs.current[index];
    const content = contentRefs.current[index];
    if (!details || !content) {
      onDone();
      return;
    }

    if (prefersReducedMotion()) {
      details.removeAttribute("open");
      onDone();
      return;
    }

    const startHeight = content.scrollHeight;
    content.style.overflow = "hidden";
    content.style.height = `${startHeight}px`;
    void content.offsetHeight;

    const animation = content.animate(
      [{ height: `${startHeight}px` }, { height: "0px" }],
      { duration: DURATION, easing: EASE }
    );
    animation.onfinish = () => {
      details.removeAttribute("open");
      content.style.height = "";
      content.style.overflow = "";
      onDone();
    };
  };

  const openItem = (index: number, onDone: () => void) => {
    const details = detailsRefs.current[index];
    const content = contentRefs.current[index];
    if (!details || !content) {
      onDone();
      return;
    }

    details.setAttribute("open", "");

    if (prefersReducedMotion()) {
      onDone();
      return;
    }

    const endHeight = content.scrollHeight;
    content.style.overflow = "hidden";
    content.style.height = "0px";
    void content.offsetHeight;

    const animation = content.animate(
      [{ height: "0px" }, { height: `${endHeight}px` }],
      { duration: DURATION, easing: EASE }
    );
    animation.onfinish = () => {
      content.style.height = "";
      content.style.overflow = "";
      onDone();
    };
  };

  const handleToggle = (index: number) => {
    if (animatingRef.current) return;

    const prevIndex = openIndexRef.current;

    if (index === prevIndex) {
      animatingRef.current = true;
      openIndexRef.current = -1;
      closeItem(index, () => {
        animatingRef.current = false;
      });
      return;
    }

    animatingRef.current = true;
    openIndexRef.current = index;
    let pending = prevIndex !== -1 ? 2 : 1;
    const done = () => {
      pending -= 1;
      if (pending === 0) animatingRef.current = false;
    };
    openItem(index, done);
    if (prevIndex !== -1) closeItem(prevIndex, done);
  };

  return (
    <div className="mt-6 divide-y divide-white/15 border-y border-white/15">
      {items.map((item, index) => (
        <details
          key={item.title}
          ref={(el) => {
            detailsRefs.current[index] = el;
          }}
          open={index === 0}
          className="group"
        >
          <summary
            className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-white [&::-webkit-details-marker]:hidden"
            onClick={(event) => {
              event.preventDefault();
              handleToggle(index);
            }}
          >
            {item.title}
            <span aria-hidden="true" className="text-forge transition-transform group-open:rotate-45">+</span>
          </summary>
          <div
            ref={(el) => {
              contentRefs.current[index] = el;
            }}
          >
            <p className="pb-5 text-sm leading-relaxed text-gray-on-dark-2">{item.body}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
