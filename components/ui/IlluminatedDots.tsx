"use client";

import { useEffect, useRef } from "react";

export default function IlluminatedDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const dotGap = 22;
    const baseAlpha = 0.15;
    const radius = 160;

    let mouseX = -9999;
    let mouseY = -9999;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let y = 0; y < height; y += dotGap) {
        for (let x = 0; x < width; x += dotGap) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const illum = Math.max(0, (radius - dist) / radius);
          const alpha = Math.min(1, baseAlpha + illum * 0.9);

          ctx.fillStyle = `rgba(148,163,184,${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      draw();
    }

    function onTouch(e: TouchEvent) {
      if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
      draw();
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch);

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      draw();
    });

    draw();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
