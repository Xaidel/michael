import { useMemo } from 'react'
import * as THREE from 'three'

export default function Mobius({
  thickness = 0.6,
  depth = 0.5
}) {
  const geometry = useMemo(() => {
    const segU = 180
    const segV = 40
    const segW = 8
    const R = 2

    const positions = []
    const indices = []

    const idx = (i, j, k) =>
      i * (segV + 1) * (segW + 1) +
      j * (segW + 1) +
      k

    const mobius = (u, v) => {
      const phi = u / 2
      return new THREE.Vector3(
        (R + v * Math.cos(phi)) * Math.cos(u),
        (R + v * Math.cos(phi)) * Math.sin(u),
        v * Math.sin(phi)
      )
    }

    // Generate vertices
    for (let i = 0; i <= segU; i++) {
      const u = (i / segU) * Math.PI * 2

      for (let j = 0; j <= segV; j++) {
        const v = (j / segV - 0.5) * thickness
        const center = mobius(u, v)

        // Surface normal
        const eps = 0.0001
        const pu = mobius(u + eps, v)
        const pv = mobius(u, v + eps)
        const normal = pv.clone().sub(center)
          .cross(pu.clone().sub(center))
          .normalize()

        for (let k = 0; k <= segW; k++) {
          const w = (k / segW - 0.5) * depth
          const p = center.clone().addScaledVector(normal, w)
          positions.push(p.x, p.y, p.z)
        }
      }
    }

    // Faces inside the volume
    const quad = (a, b, c, d) => {
      indices.push(a, b, d, b, c, d)
    }

    for (let i = 0; i < segU; i++) {
      for (let j = 0; j < segV; j++) {
        for (let k = 0; k < segW; k++) {
          const a = idx(i, j, k)
          const b = idx(i + 1, j, k)
          const c = idx(i + 1, j + 1, k)
          const d = idx(i, j + 1, k)

          const a2 = idx(i, j, k + 1)
          const b2 = idx(i + 1, j, k + 1)
          const c2 = idx(i + 1, j + 1, k + 1)
          const d2 = idx(i, j + 1, k + 1)

          quad(a, b, d, c)
          quad(a2, d2, b2, c2)

          quad(a, a2, b, b2)
          quad(d, c, d2, c2)
          quad(a, d, a2, d2)
          quad(b, b2, c, c2)
        }
      }
    }

    // 🔒 CLOSE THE MÖBIUS SEAM (critical part)
    for (let j = 0; j < segV; j++) {
      for (let k = 0; k < segW; k++) {
        const a = idx(0, j, k)
        const b = idx(segU, segV - j, k)
        const c = idx(segU, segV - j, k + 1)
        const d = idx(0, j, k + 1)
        quad(a, b, d, c)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()

    return geo
  }, [thickness, depth])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#c97a22"
        roughness={0.3}
        metalness={0.0}
        wireframe
      />
    </mesh>
  )
}
