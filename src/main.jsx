import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const canvas = document.createElement("canvas");
canvas.id = "galaxy-bg";
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const stars = Array.from({ length: 280 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.6 + 0.3,
  alpha: Math.random() * 0.8 + 0.2,
  speed: Math.random() * 0.004 + 0.001,
  twinkleOffset: Math.random() * Math.PI * 2,
}));

const glitters = Array.from({ length: 22 }, () => ({
  x: Math.random(),
  y: Math.random(),
  size: Math.random() * 4 + 2,
  alpha: Math.random(),
  speed: Math.random() * 0.008 + 0.003,
  offset: Math.random() * Math.PI * 2,
}));

let t = 0;

function draw() {
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "#06040f";
  ctx.fillRect(0, 0, W, H);

  const grad1 = ctx.createRadialGradient(W * 0.8, H * 0.1, 0, W * 0.8, H * 0.1, W * 0.55);
  grad1.addColorStop(0, "rgba(120, 50, 230, 0.35)");
  grad1.addColorStop(0.5, "rgba(80, 20, 180, 0.15)");
  grad1.addColorStop(1, "transparent");
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, W, H);

  const grad2 = ctx.createRadialGradient(W * 0.1, H * 0.9, 0, W * 0.1, H * 0.9, W * 0.45);
  grad2.addColorStop(0, "rgba(90, 30, 200, 0.28)");
  grad2.addColorStop(0.5, "rgba(60, 10, 150, 0.12)");
  grad2.addColorStop(1, "transparent");
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, W, H);

  const grad3 = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.3);
  grad3.addColorStop(0, "rgba(100, 40, 200, 0.1)");
  grad3.addColorStop(1, "transparent");
  ctx.fillStyle = grad3;
  ctx.fillRect(0, 0, W, H);

  stars.forEach(s => {
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * s.speed * 60 + s.twinkleOffset));
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 200, 255, ${s.alpha * twinkle})`;
    ctx.fill();
  });

  glitters.forEach(g => {
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(t * g.speed * 60 + g.offset));
    const x = g.x * W;
    const y = g.y * H;
    const sz = g.size * pulse;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * 0.4 + g.offset);

    ctx.beginPath();
    ctx.moveTo(0, -sz);
    ctx.lineTo(sz * 0.22, -sz * 0.22);
    ctx.lineTo(sz, 0);
    ctx.lineTo(sz * 0.22, sz * 0.22);
    ctx.lineTo(0, sz);
    ctx.lineTo(-sz * 0.22, sz * 0.22);
    ctx.lineTo(-sz, 0);
    ctx.lineTo(-sz * 0.22, -sz * 0.22);
    ctx.closePath();

    ctx.fillStyle = `rgba(200, 160, 255, ${pulse * 0.95})`;
    ctx.shadowColor = "rgba(180, 120, 255, 0.8)";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  });

  t += 0.016;
  requestAnimationFrame(draw);
}

draw();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);