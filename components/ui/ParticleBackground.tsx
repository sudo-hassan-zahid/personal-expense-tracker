"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2;
  }

  update(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(252, 213, 53, 0.2)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Grid-based spatial partitioning for O(n) neighbor lookups instead of O(n²).
 * Divides the canvas into cells; only checks particles in the same or adjacent cells.
 */
class SpatialGrid {
  private cellSize: number;
  private cols: number;
  private rows: number;
  private grid: Map<number, Particle[]>;

  constructor(width: number, height: number, cellSize: number) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.grid = new Map();
  }

  clear() {
    this.grid.clear();
  }

  getKey(col: number, row: number): number {
    return row * this.cols + col;
  }

  insert(p: Particle) {
    const col = Math.floor(p.x / this.cellSize);
    const row = Math.floor(p.y / this.cellSize);
    const key = this.getKey(col, row);
    if (!this.grid.has(key)) this.grid.set(key, []);
    this.grid.get(key)!.push(p);
  }

  getNeighbors(p: Particle): Particle[] {
    const col = Math.floor(p.x / this.cellSize);
    const row = Math.floor(p.y / this.cellSize);
    const neighbors: Particle[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = this.getKey(col + dx, row + dy);
        const cell = this.grid.get(key);
        if (cell) {
          for (const other of cell) {
            if (other !== p) neighbors.push(other);
          }
        }
      }
    }
    return neighbors;
  }
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouse = { x: 0, y: 0 };
    let animationFrameId: number;
    const CONNECTION_DIST = 100;

    // Spatial grid for O(n) neighbor checks instead of O(n²)
    let grid: SpatialGrid;

    const init = () => {
      particles = [];
      // Reduced particle density: /25000 instead of /15000
      const count = Math.floor((canvas.width * canvas.height) / 25000);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
      grid = new SpatialGrid(canvas.width, canvas.height, CONNECTION_DIST);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    // Throttle mousemove to max 60fps
    let lastMouseMove = 0;
    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseMove < 16) return;
      lastMouseMove = now;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Frame-rate cap at 30fps — decorative background doesn't need 60fps
    let lastFrame = 0;
    const FRAME_INTERVAL = 33; // ~30fps

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (time - lastFrame < FRAME_INTERVAL) return;
      lastFrame = time;

      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rebuild spatial grid each frame
      grid.clear();
      particles.forEach(p => grid.insert(p));

      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);

        // O(n) neighbor check via spatial grid instead of O(n²)
        const neighbors = grid.getNeighbors(p);
        for (const p2 of neighbors) {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
            const dist = Math.sqrt(distSq);
            ctx.strokeStyle = `rgba(252, 213, 53, ${0.1 * (1 - dist / CONNECTION_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Line to mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 150 * 150) {
          const dist = Math.sqrt(distSq);
          ctx.strokeStyle = `rgba(252, 213, 53, ${0.2 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}
