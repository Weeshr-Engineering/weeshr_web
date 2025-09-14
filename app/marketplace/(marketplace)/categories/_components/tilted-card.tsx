"use client";

import type { SpringOptions } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import "./TiltedCard.css";

interface TiltedCardProps {
  children: React.ReactNode;
  containerHeight?: React.CSSProperties["height"];
  containerWidth?: React.CSSProperties["width"];
  scaleOnHover?: number;
  rotateAmplitude?: number;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  children,
  containerHeight = "300px",
  containerWidth = "100%",
  scaleOnHover = 1.05,
  rotateAmplitude = 14,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);
  const scale = useSpring(1, springValues);

  const [isMobile, setIsMobile] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 640);
    }
  }, []);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    // update glare
    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    setGlarePos({ x: 50, y: 50 });
  }

  if (isMobile) {
    return (
      <div
        className="tilted-card-figure"
        style={{ height: containerHeight, width: containerWidth }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.figure
      ref={ref}
      className="tilted-card-figure relative"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tilted-card-inner relative w-full h-full rounded-3xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          scale,
        }}
      >
        {children}

        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35), transparent 80%)`,
            mixBlendMode: "soft-light",
          }}
        />
      </motion.div>
    </motion.figure>
  );
}
