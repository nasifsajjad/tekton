"use client";

import { useEffect, useRef, useState } from "react";

const STAGES = [
  { at: 0, label: "Mechanical", detail: "Bearing online" },
  { at: 0.22, label: "Pneumatics", detail: "Motion engaged" },
  { at: 0.43, label: "Flow control", detail: "Valve opening" },
  { at: 0.64, label: "Instrumentation", detail: "Process monitored" },
  { at: 0.84, label: "Electrical", detail: "Systems live" },
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
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let frame = 0;
    let stage = -1;
    let seekInFlight = false;
    let seekRecovery = 0;
    let targetTime = START_TIME;

    const clearSeekRecovery = () => {
      if (seekRecovery) window.clearTimeout(seekRecovery);
      seekRecovery = 0;
    };

    const seekToLatest = () => {
      if (seekInFlight || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0 || video.seekable.length === 0) return;

      const nextTime = Math.min(Math.max(0, video.duration - 0.01), targetTime);
      if (Math.abs(video.currentTime - nextTime) <= SEEK_STEP / 2) return;

      try {
        seekInFlight = true;
        video.currentTime = nextTime;
        // A stalled range request must not leave desktop playback permanently
        // locked on the first frame. The next progress/scroll event retries it.
        clearSeekRecovery();
        seekRecovery = window.setTimeout(() => {
          seekInFlight = false;
          seekToLatest();
        }, 900);
      } catch {
        seekInFlight = false;
      }
    };

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
      targetTime = Math.min(duration - 0.01, Math.round(time / SEEK_STEP) * SEEK_STEP);
      seekToLatest();
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onReady = () => {
      setVideoReady(true);
      requestUpdate();
    };
    const onMetadata = () => {
      video.pause();
      requestUpdate();
      seekToLatest();
    };
    const onSeeked = () => {
      clearSeekRecovery();
      seekInFlight = false;
      seekToLatest();
    };
    const onProgress = () => seekToLatest();

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("progress", onProgress);

    // Assign one concrete source instead of relying on <source media>, whose
    // desktop handling varies between browser engines.
    video.src = window.matchMedia("(max-width: 767px)").matches
      ? "/media/industrial-hero-mobile.mp4"
      : "/media/industrial-hero-web.mp4";
    video.muted = true;
    video.playsInline = true;
    video.pause();
    video.load();
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearSeekRecovery();
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("progress", onProgress);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section ref={sectionRef} className="industrial-sequence industrial-sequence--scroll" aria-labelledby="industry-sequence-title">
      <div className="industrial-sequence__sticky">
        {/* The poster is a real element rather than only a video attribute, so
            Safari/iOS and failed media requests always retain a meaningful frame. */}
        <img
          src="/media/industrial-hero-poster.jpg"
          alt=""
          aria-hidden="true"
          className="industrial-sequence__fallback"
          decoding="async"
        />
        <video
          ref={videoRef}
          className={`industrial-sequence__video ${videoReady && !videoFailed ? "industrial-sequence__video--ready" : ""}`}
          muted
          playsInline
          preload="auto"
          poster="/media/industrial-hero-poster.jpg"
          disablePictureInPicture
          onError={() => setVideoFailed(true)}
          aria-label={alt}
        >
          <img src="/media/industrial-hero-poster.jpg" alt={alt} />
        </video>
        <div className="industrial-sequence__shade" aria-hidden="true" />
        <div className="industrial-sequence__content rail">
          <h2 id="industry-sequence-title" className="display max-w-[11ch] text-header-lg text-white sm:text-header-xl">
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
