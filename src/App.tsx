"use client"

import { useDebounce } from "use-debounce";

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Mobius from "./components/Mobius"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import FormulaBlock from "./components/Formula"
import CodeBlock from "./components/Code"

export default function App() {
  const [thickness, setThickness] = useState(0.6)
  const [depth, setDepth] = useState(0.25)
  const [thicknessDebounced] = useDebounce(thickness, 120);
  const [depthDebounced] = useDebounce(depth, 120);
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen p-4">
      <div className=" text-justify max-w-7xl">
        <h1 className="font-bold text-3xl text-blue-300 text-center">Project ni Michael Garcera</h1>
        <div className=" w-full px-4 max-w-4xl text-sm">
          <p>
            <span className="font-bold">Important Note: </span> Due to technical constraints of ThreeJS and React, We can't remove
            the vertices gaps since it is a topological stitching error as well as reduce the lag since there are a lot of vertices and faces needed to display a solid(3d) mobius strip
          </p>
          <p>
            <span className="font-bold">Important Note: </span>
            This implementation is a <span className="font-bold">non-trivial geometry </span>
            and every segments, vertices, and faces are computed manually and since this is a computationally heavy task, some devices <span className="font-bold">might lag </span>
            a bit(or a lot), but you can take a look at the individual segments if you try to zoom in and each and every one of
            them are  <span className="font-bold">computed, and connected individually(programmatically) to form a mobius shape </span>
          </p>
          <p className="font-bold text-blue-300">Submitted by: Michael Garcera's Group</p>
        </div>
        <div className="flex gap-2 justify-center my-4">
          <p>Width: </p>
          <Slider value={[thickness]} min={0.2} max={1.2} step={0.01} onValueChange={([v]) => setThickness(v)} />

          <p>Depth: </p>
          <Slider value={[depth]} min={0.05} max={1.0} step={0.01} onValueChange={([v]) => setDepth(v)} />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-7xl">
        <div className="w-full lg:w-1/3 h-[400px] lg:h-[600px]">
          <CodeBlock depth={depth} thickness={thickness} />
        </div>
        <div className="w-full lg:w-1/3 h-[400px] lg:h-[600px]">
          <Canvas className="w-full h-full" camera={{ position: [4, 4, 4], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} />

            <Mobius thickness={thicknessDebounced} depth={depthDebounced} />
            <OrbitControls />
          </Canvas>
        </div>
        <div className="w-full lg:w-1/3 h-[400px] lg:h-[600px]">
          <FormulaBlock depth={depth} thickness={thickness} />
        </div>
      </div>
    </div>
  )
}
