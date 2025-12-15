export default function FormulaBlock({ thickness, depth }: { thickness: number; depth: number }) {
  return (
    <div className="w-full h-full bg-white p-4 lg:p-6 rounded shadow overflow-auto">
      <h2 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">Mathematical Model</h2>

      <p className="mb-2 text-sm lg:text-base">
        <strong>Möbius Strip Parametrization:</strong>
      </p>

      <pre className="bg-gray-100 p-2 lg:p-3 rounded mb-3 lg:mb-4 text-xs lg:text-sm">
        {`x(u, v) = (R + v cos(u/2)) cos(u)
y(u, v) = (R + v cos(u/2)) sin(u)
z(u, v) = v sin(u/2)`}
      </pre>

      <p className="mb-2 text-sm lg:text-base">
        <strong>Current Parameters:</strong>
      </p>

      <ul className="list-disc ml-6 text-sm lg:text-base">
        <li>
          Width (thickness): <strong>{thickness.toFixed(2)}</strong>
        </li>
        <li>
          Depth (solid extrusion): <strong>{depth.toFixed(2)}</strong>
        </li>
      </ul>

      <p className="mt-3 lg:mt-4 text-sm lg:text-base">
        The solid Möbius band is formed by extruding the surface along its normal vector by ± depth / 2, producing a
        closed 3D volume.
      </p>
    </div>
  )
}
