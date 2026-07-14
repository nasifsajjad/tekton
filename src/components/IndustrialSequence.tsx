"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_COUNT = 300;
const FRAME_PATHS = Array.from(
  { length: FRAME_COUNT },
  (_, index) => `/media/industrial-sequence/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`,
);

const STAGES = [
  { at: 0, label: "Mechanical", detail: "Bearing online" },
  { at: 0.18, label: "Pneumatics", detail: "Motion engaged" },
  { at: 0.36, label: "Flow control", detail: "Valve opening" },
  { at: 0.56, label: "Instrumentation", detail: "Pressure in range" },
  { at: 0.74, label: "Safety", detail: "Atmosphere monitored" },
  { at: 0.9, label: "Electrical", detail: "Systems live" },
];

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
  const [loaded, setLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let cancelled = false;
    let animation: gsap.core.Tween | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const images: HTMLImageElement[] = [];
    let lastFrame = -1;

    const render = (frameIndex: number) => {
      const image = images[frameIndex];
      const context = canvas.getContext("2d");
      if (!image || !context) return;

      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const requiredWidth = Math.round(width * pixelRatio);
      const requiredHeight = Math.round(height * pixelRatio);

      if (canvas.width !== requiredWidth || canvas.height !== requiredHeight) {
        canvas.width = requiredWidth;
        canvas.height = requiredHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      drawCover(context, image, width, height);
    };

    const updateStage = (frameIndex: number) => {
      const progress = frameIndex / (FRAME_COUNT - 1);
      const nextStage = STAGES.reduce((selected, stage, index) => (progress >= stage.at ? index : selected), 0);
      if (nextStage !== activeStageRef.current) {
        activeStageRef.current = nextStage;
        setActiveStage(nextStage);
      }
    };

    const preload = async () => {
      await Promise.all(
        FRAME_PATHS.map(
          (source) =>
            new Promise<void>((resolve) => {
              const image = new Image();
              image.decoding = "async";
              image.onload = () => {
                if (!cancelled) setLoaded((count) => count + 1);
                resolve();
              };
              image.onerror = () => resolve();
              images.push(image);
              image.src = source;
            }),
        ),
      );

      if (cancelled) return;
      render(0);
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
          if (frameIndex === lastFrame) return;
          lastFrame = frameIndex;
          render(frameIndex);
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

      resizeObserver = new ResizeObserver(() => render(lastFrame < 0 ? 0 : lastFrame));
      resizeObserver.observe(section);
      ScrollTrigger.refresh();
    };

    void preload();

    return () => {
      cancelled = true;
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
          Keep industry moving.
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
          Loading operational sequence {Math.round((loaded / FRAME_COUNT) * 100)}%
        </p>
      )}
    </section>
  );
}
