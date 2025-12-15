self.onmessage = (e) => {
  const { thickness, depth } = e.data;

  const segU = depth > 0.6 ? 120 : 180;
  const segV = thickness > 0.9 ? 30 : 40;
  const segW = 8;
  const R = 2;

  const positions = [];
  const indices = [];

  const idx = (i, j, k) =>
    i * (segV + 1) * (segW + 1) +
    j * (segW + 1) +
    k;

  const mobius = (u, v) => {
    const phi = u / 2;
    return {
      x: (R + v * Math.cos(phi)) * Math.cos(u),
      y: (R + v * Math.cos(phi)) * Math.sin(u),
      z: v * Math.sin(phi)
    };
  };

  const sub = (a, b) => ({
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  });

  const cross = (a, b) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  });

  const normalize = (v) => {
    const len = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / len, y: v.y / len, z: v.z / len };
  };

  // Generate vertices
  for (let i = 0; i <= segU; i++) {
    const u = (i / segU) * Math.PI * 2;

    for (let j = 0; j <= segV; j++) {
      const v = (j / segV - 0.5) * thickness;
      const center = mobius(u, v);

      const eps = 0.0001;
      const pu = mobius(u + eps, v);
      const pv = mobius(u, v + eps);

      const normal = normalize(cross(sub(pv, center), sub(pu, center)));

      for (let k = 0; k <= segW; k++) {
        const w = (k / segW - 0.5) * depth;
        positions.push(
          center.x + normal.x * w,
          center.y + normal.y * w,
          center.z + normal.z * w
        );
      }
    }
  }

  // faces
  const quad = (a, b, c, d) => {
    indices.push(a, b, d, b, c, d);
  };

  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      for (let k = 0; k < segW; k++) {
        const a = idx(i, j, k);
        const b = idx(i + 1, j, k);
        const c = idx(i + 1, j + 1, k);
        const d = idx(i, j + 1, k);

        const a2 = idx(i, j, k + 1);
        const b2 = idx(i + 1, j, k + 1);
        const c2 = idx(i + 1, j + 1, k + 1);
        const d2 = idx(i, j + 1, k + 1);

        quad(a, b, d, c);
        quad(a2, d2, b2, c2);
        quad(a, a2, b, b2);
        quad(d, c, d2, c2);
        quad(a, d, a2, d2);
        quad(b, b2, c, c2);
      }
    }
  }

  // seam (keep your original logic)
  for (let j = 0; j < segV; j++) {
    for (let k = 0; k < segW; k++) {
      const a = idx(0, j, k);
      const b = idx(segU, segV - j, k);
      const c = idx(segU, segV - j, k + 1);
      const d = idx(0, j, k + 1);
      quad(a, b, d, c);
    }
  }

  // Send typed arrays back
  self.postMessage({
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
  });
};
