"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_COUNT = 300;
const FRAME_PATHS = Array.from(
  { length: FRAME_COUNT },
  (_, index) => `/media/industrial-sequence/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`,
);

// How many frame requests may be in flight at once. Keeps the network and the
// server responsive instead of firing all 300 requests simultaneously.
const MAX_CONCURRENT_LOADS = 6;

const STAGES = [
  { at: 0, label: "Mechanical", detail: "Bearing online" },
  { at: 0.18, label: "Pneumatics", detail: "Motion engaged" },
  { at: 0.36, label: "Flow control", detail: "Valve opening" },
  { at: 0.56, label: "Instrumentation", detail: "Pressure in range" },
  { at: 0.74, label: "Safety", detail: "Atmosphere monitored" },
  { at: 0.9, label: "Electrical", detail: "Systems live" },
];

// Coarse-to-fine order: every 32nd frame first, then 8th, 2nd, then the rest.
// Scrubbing looks correct almost immediately and refines as frames stream in.
function buildLoadOrder(count: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  for (const stride of [32, 8, 2, 1]) {
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

export default function IndustrialSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeStageRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let cancelled = false;
    let animation: gsap.core.Tween | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let rafId = 0;
    const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let targetFrame = 0;
    let drawnFrame = -1;
    let viewWidth = 0;
    let viewHeight = 0;

    // Measured once and on resize instead of per-drawn-frame; calling
    // getBoundingClientRect inside the scroll handler forces layout every tick.
    const measure = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      viewWidth = Math.max(1, Math.round(bounds.width));
      viewHeight = Math.max(1, Math.round(bounds.height));
      canvas.width = Math.round(viewWidth * pixelRatio);
      canvas.height = Math.round(viewHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    };

    // Nearest loaded frame to the requested index, so scrubbing works while
    // the full sequence is still streaming in.
    const nearestLoaded = (index: number): number => {
      if (images[index]) return index;
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        if (index - offset >= 0 && images[index - offset]) return index - offset;
        if (index + offset < FRAME_COUNT && images[index + offset]) return index + offset;
      }
      return -1;
    };

    const draw = () => {
      rafId = 0;
      const frameIndex = nearestLoaded(targetFrame);
      if (frameIndex < 0 || frameIndex === drawnFrame) return;
      const image = images[frameIndex];
      if (!image) return;
      drawnFrame = frameIndex;
      drawCover(context, image, viewWidth, viewHeight);
    };

    // Batch draws through requestAnimationFrame so rapid scrub updates paint
    // at most once per display frame.
    const requestDraw = () => {
      if (!rafId) rafId = requestAnimationFrame(draw);
    };

    const updateStage = (frameIndex: number) => {
      const progress = frameIndex / (FRAME_COUNT - 1);
      const nextStage = STAGES.reduce((selected, stage, index) => (progress >= stage.at ? index : selected), 0);
      if (nextStage !== activeStageRef.current) {
        activeStageRef.current = nextStage;
        setActiveStage(nextStage);
      }
    };

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.decoding = "async";
        // Keep frame streaming from competing with above-the-fold assets.
        image.setAttribute("fetchpriority", "low");
        image.onload = () => {
          if (!cancelled) {
            images[index] = image;
            // Redraw if this frame improves what is currently on screen.
            if (nearestLoaded(targetFrame) === index) {
              drawnFrame = -1;
              requestDraw();
            }
          }
          resolve();
        };
        image.onerror = () => resolve();
        image.src = FRAME_PATHS[index];
      });

    // Stream the remaining frames through a small worker pool instead of
    // requesting all of them at once.
    const streamFrames = (order: number[]) => {
      let cursor = 0;
      const next = (): Promise<void> => {
        if (cancelled || cursor >= order.length) return Promise.resolve();
        const index = order[cursor++];
        const step = images[index] ? Promise.resolve() : loadFrame(index);
        return step.then(next);
      };
      for (let i = 0; i < MAX_CONCURRENT_LOADS; i++) void next();
    };

    const start = async () => {
      // Only the first frame gates interactivity; everything else streams in
      // behind it.
      await loadFrame(0);
      if (cancelled) return;

      measure();
      requestDraw();
      setIsReady(true);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.registerPlugin(ScrollTrigger);
      const frame = { value: 0 };
      animation = gsap.to(frame, {
        value: FRAME_COUNT - 1,
        ease: "none",
        snap: "value",
        onUpdate: () => {
          const frameIndex = Math.round(frame.value);
          if (frameIndex === targetFrame) return;
          targetFrame = frameIndex;
          requestDraw();
          updateStage(frameIndex);
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 5, 4200)}`,
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      resizeObserver = new ResizeObserver(() => {
        measure();
        drawnFrame = -1;
        requestDraw();
      });
      resizeObserver.observe(section);
      ScrollTrigger.refresh();

      streamFrames(buildLoadOrder(FRAME_COUNT));
    };

    void start();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      animation?.scrollTrigger?.kill();
      animation?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="industrial-sequence" aria-labelledby="industry-sequence-title">
      <img
        className={`industrial-sequence__fallback ${isReady ? "industrial-sequence__fallback--hidden" : ""}`}
        src={FRAME_PATHS[0]}
        alt="Industrial bearing operating inside a production facility"
      />
      <canvas ref={canvasRef} className={`industrial-sequence__canvas ${isReady ? "industrial-sequence__canvas--ready" : ""}`} aria-hidden="true" />

      <div className="industrial-sequence__shade" aria-hidden="true" />
      <div className="industrial-sequence__content rail">
        <p className="eyebrow text-forge">Tekton operational sequence</p>
        <h2 id="industry-sequence-title" className="display mt-3 max-w-[11ch] text-header-lg text-white sm:text-header-xl">
          Keep the industry moving.
        </h2>
        <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-gray-on-dark-2 sm:text-lg">
          From a single rotating bearing to a fully operational plant, every component has a role to play.
        </p>
      </div>

      <div className="industrial-sequence__stage" aria-live="polite">
        <span className="eyebrow text-forge">{STAGES[activeStage].label}</span>
        <span className="mt-2 block text-sm font-medium text-white">{STAGES[activeStage].detail}</span>
      </div>

      <div className="industrial-sequence__progress" aria-hidden="true">
        <span className="industrial-sequence__progress-label">Scroll to activate</span>
        <span className="industrial-sequence__progress-line"><span style={{ transform: `scaleX(${(activeStage + 1) / STAGES.length})` }} /></span>
      </div>

      {!isReady && (
        <p className="industrial-sequence__loading" role="status">
          Loading operational sequence
        </p>
      )}
    </section>
  );
}
