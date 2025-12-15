import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function Mobius({ thickness = 0.6, depth = 0.5 }) {
  const meshRef = useRef(null);

  const worker = useMemo(
    () => new Worker(new URL("./mobiusWorker.js", import.meta.url), { type: "module" }),
    []
  );

  useEffect(() => {
    if (!worker) return;

    worker.postMessage({ thickness, depth });

    worker.onmessage = (e) => {
      const { positions, indices } = e.data;

      if (!meshRef.current) return;

      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(positions), 3)
      );

      geo.setIndex(
        new THREE.BufferAttribute(new Uint32Array(indices), 1)
      );

      geo.computeVertexNormals();

      meshRef.current.geometry?.dispose();
      meshRef.current.geometry = geo;
    };
  }, [thickness, depth]);

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial wireframe color="#c97a22" />
    </mesh>
  );
}
