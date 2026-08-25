"use client";

import { useEffect, useRef, useState } from "react";

const STAGES = [
  { at: 0, label: "Mechanical", detail: "Bearing online" },
  { at: 0.18, label: "Pneumatics", detail: "Motion engaged" },
  { at: 0.36, label: "Flow control", detail: "Valve opening" },
  { at: 0.56, label: "Instrumentation", detail: "Pressure in range" },
  { at: 0.74, label: "Safety", detail: "Atmosphere monitored" },
  { at: 0.9, label: "Electrical", detail: "Systems live" },
];

// Begin on a meaningful visible frame rather than an empty first frame, and
// seek at a video-friendly cadence instead of interrupting the decoder on
// every scroll event.
const START_TIME = 1;
const SEEK_STEP = 1 / 24;

/** Scroll-scrubbed hero, optimized from the supplied 4K source for web playback. */
export default function IndustrialSequence({ alt = "Industrial operations in motion" }: { alt?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let frame = 0;
    let stage = -1;
    let waitingForSeek = false;
    let seekPending = false;
    const update = () => {
      frame = 0;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - top) / travel));
      const nextStage = STAGES.reduce((selected, item, index) => (progress >= item.at ? index : selected), 0);
      if (nextStage !== stage) {
        stage = nextStage;
        setActiveStage(nextStage);
      }
      const time = START_TIME + progress * Math.max(0, duration - START_TIME);
      const targetTime = Math.min(duration, Math.round(time / SEEK_STEP) * SEEK_STEP);
      if (Math.abs(video.currentTime - targetTime) <= SEEK_STEP / 2) return;
      if (waitingForSeek || video.seeking) {
        seekPending = true;
        return;
      }
      waitingForSeek = true;
      video.currentTime = targetTime;
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    video.pause();
    video.addEventListener("loadedmetadata", requestUpdate);
    const onSeeked = () => {
      waitingForSeek = false;
      if (seekPending) {
        seekPending = false;
        requestUpdate();
      }
    };
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", requestUpdate);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section ref={sectionRef} className="industrial-sequence industrial-sequence--scroll" aria-labelledby="industry-sequence-title">
      <div className="industrial-sequence__sticky">
        <video
          ref={videoRef}
          className="industrial-sequence__video"
          muted
          playsInline
          preload="auto"
          poster="/media/industrial-hero-poster.jpg"
          aria-label={alt}
        >
          <source src="/media/industrial-hero-web.mp4" type="video/mp4" />
        </video>
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
      </div>
    </section>
  );
}
