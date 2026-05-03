"use client";

import { useEffect, useRef } from "react";

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: { x: number; y: number; age: number }[] = [];
    let sparkles: { x: number; y: number; vx: number; vy: number; age: number; color: string }[] =
      [];
    const maxAge = 40;
    const sparkleMaxAge = 60;
    const MAX_POINTS = 50; // Cap trail length to prevent unbounded growth
    const MAX_SPARKLES = 40; // Cap sparkle count
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const colors = ["#fcd535", "#f0b90b", "#ffffff", "#3b82f6"];

    // Throttle mousemove to 16ms intervals (60fps cap)
    let lastMove = 0;
    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMove < 16) return;
      lastMove = now;

      points.push({ x: e.clientX, y: e.clientY, age: 0 });

      // Cap trail points to prevent unbounded memory growth
      if (points.length > MAX_POINTS) {
        points = points.slice(-MAX_POINTS);
      }

      // Add sparkles (only 1 per move instead of 2, with cap)
      if (sparkles.length < MAX_SPARKLES) {
        sparkles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          age: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    // Frame-rate cap at 30fps — cursor trail is decorative
    let lastFrame = 0;
    const FRAME_INTERVAL = 33;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (time - lastFrame < FRAME_INTERVAL) return;
      lastFrame = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Trail
      points = points.filter((p) => p.age < maxAge);
      points.forEach((p) => (p.age += 1));

      if (points.length > 1) {
        // Optimization: Removed shadowBlur as it's extremely expensive
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          const p = points[i];
          const opacity = 1 - p.age / maxAge;
          ctx.strokeStyle = `rgba(252, 213, 53, ${opacity * 0.8})`;
          ctx.lineWidth = opacity * 8; // Slightly thinner for better performance
          ctx.lineCap = "round";
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        }
      }

      // Draw Sparkles
      sparkles = sparkles.filter((s) => s.age < sparkleMaxAge);
      sparkles.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.age += 1;
        s.vy += 0.1; // gravity

        const opacity = 1 - s.age / sparkleMaxAge;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };


    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    resize();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
}
