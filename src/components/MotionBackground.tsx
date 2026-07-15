"use client";

import { useEffect, useRef } from "react";

/**
 * Animated industrial "blueprint" background: a drifting grid of nodes
 * connected by faint lines, with occasional orange glints. Pure canvas,
 * no assets. Renders a single static frame when reduced motion is set.
 */
export default function MotionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      glint: number; // 0..1 — orange highlight intensity
    }

    let nodes: Node[] = [];

    function resize() {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const count = Math.max(28, Math.floor((width * height) / 26000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1.6,
        glint: Math.random() < 0.12 ? Math.random() : 0,
      }));
    }

    const LINK_DIST = 150;

    function frame() {
      ctx!.clearRect(0, 0, width, height);

      // Faint structural grid
      ctx!.strokeStyle = "rgba(255,255,255,0.035)";
      ctx!.lineWidth = 1;
      const cell = 80;
      for (let x = 0.5; x < width; x += cell) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0.5; y < height; y += cell) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }

      // Links between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.16;
            ctx!.strokeStyle =
              a.glint > 0.5 || b.glint > 0.5
                ? `rgba(249, 160, 60, ${alpha * 0.9})`
                : `rgba(255, 255, 255, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle =
          n.glint > 0.5
            ? `rgba(249, 160, 60, ${0.5 + n.glint * 0.5})`
            : "rgba(255, 255, 255, 0.35)";
        ctx!.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;

        // Slowly pulse the glints
        if (n.glint > 0) {
          n.glint += (Math.random() - 0.5) * 0.04;
          n.glint = Math.max(0.3, Math.min(1, n.glint));
        }
      }
    }

    function loop() {
      if (!running) return;
      frame();
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (reduceMotion) {
      frame(); // single static frame
    } else {
      loop();
    }

    // Only animate while the canvas is actually on screen; the hero sits below
    // the pinned scroll sequence, so this avoids burning frames off-screen.
    let onScreen = true;
    const setRunning = (shouldRun: boolean) => {
      if (reduceMotion) return;
      if (shouldRun && !running) {
        running = true;
        loop();
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onResize = () => resize();
    const onVisibility = () => setRunning(!document.hidden && onScreen);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        setRunning(!document.hidden && onScreen);
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(canvas);

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
