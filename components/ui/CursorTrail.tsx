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
    let sparkles: { x: number; y: number; vx: number; vy: number; age: number; color: string }[] = [];
    const maxAge = 40;
    const sparkleMaxAge = 60;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const colors = ["#fcd535", "#f0b90b", "#ffffff", "#3b82f6"];

    const onMouseMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY, age: 0 });

      // Add sparkles
      for (let i = 0; i < 2; i++) {
        sparkles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          age: 0,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Trail
      points = points.filter((p) => p.age < maxAge);
      points.forEach((p) => (p.age += 1));

      if (points.length > 1) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#fcd535";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          const p = points[i];
          const opacity = 1 - p.age / maxAge;
          ctx.strokeStyle = `rgba(252, 213, 53, ${opacity * 0.8})`;
          ctx.lineWidth = opacity * 12;
          ctx.lineCap = "round";
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        }
        ctx.shadowBlur = 0;
      }

      // Draw Sparkles
      sparkles = sparkles.filter(s => s.age < sparkleMaxAge);
      sparkles.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.age += 1;
        s.vy += 0.1; // gravity

        const opacity = 1 - s.age / sparkleMaxAge;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}
