"use client";

/**
 * Fixed, pointer-events-none ambient layer: noise texture + two very soft
 * blurred blobs + a scattering of tiny static particles. Kept subtle per
 * the brief — "almost unnoticeable" — and purely decorative (aria-hidden).
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="noise-layer" />
      <div
        className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.06] blur-[120px]"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      <div
        className="absolute -bottom-52 -right-32 h-[560px] w-[560px] rounded-full opacity-[0.05] blur-[130px]"
        style={{ backgroundColor: "var(--color-success)" }}
      />
      <ParticleField />
    </div>
  );
}

function ParticleField() {
  // Deterministic pseudo-random positions so server/client markup matches.
  const particles = Array.from({ length: 24 }, (_, i) => {
    const seed = i * 137.508; // golden angle for even distribution
    return {
      left: (seed % 100).toFixed(2),
      top: ((seed * 1.618) % 100).toFixed(2),
      size: 1 + (i % 3),
      opacity: 0.08 + (i % 4) * 0.02,
    };
  });

  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: "var(--color-ink)",
            opacity: p.opacity,
          }}
        />
      ))}
    </>
  );
}
