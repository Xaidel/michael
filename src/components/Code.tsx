export default function CodeBlock({ thickness, depth }: { thickness: number; depth: number }) {
  const code = `const thickness = ${thickness.toFixed(2)};
const depth = ${depth.toFixed(2)};

v = (j / segV - 0.5) * thickness
w = (k / segW - 0.5) * depth

x = (R + v cos(u/2)) cos(u)
y = (R + v cos(u/2)) sin(u)
z = v sin(u/2)

P(u, v, w) = center + w · normal`.trim()

  return (
    <div className="w-full h-full bg-white p-4 lg:p-6 rounded shadow overflow-auto">
      <h2 className="text-lg lg:text-xl font-bold mb-2">Code (Overview)</h2>
      <pre className="text-xs lg:text-sm">{code}</pre>
    </div>
  )
}
