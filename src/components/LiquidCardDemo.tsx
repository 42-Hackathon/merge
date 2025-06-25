import { useState, useRef } from "react"
import LiquidGlass from "liquid-glass-react"

export function LiquidCardDemo() {
  // User Info Card Controls
  const [displacementScale, setDisplacementScale] = useState(100)
  const [blurAmount, setBlurAmount] = useState(0.5)
  const [saturation, setSaturation] = useState(140)
  const [aberrationIntensity, setAberrationIntensity] = useState(2)
  const [elasticity, setElasticity] = useState(0)
  const [cornerRadius, setCornerRadius] = useState(32)
  const [userInfoOverLight, setUserInfoOverLight] = useState(false)
  const [userInfoMode, setUserInfoMode] = useState<"standard" | "polar" | "prominent" | "shader">("standard")

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 shadow-2xl w-full max-w-5xl mx-auto h-screen md:max-h-[calc(100vh-5rem)] md:rounded-3xl overflow-hidden font-sans">
      {/* Left Panel - Glass Effect Demo */}
      <div className="flex-1 relative overflow-auto md:col-span-2" ref={containerRef}>
        <div className="w-full min-h-[200vh] absolute top-0 left-0 pb-96 mb-96">
          <img src="https://picsum.photos/2000/2000" className="w-full h-96 object-cover" alt="background" />
          <div className="flex flex-col gap-2 p-10" id="bright-section">
            <h2 className="text-2xl font-semibold my-5 text-center">Some Heading</h2>
            <p>
              Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger <br />
              Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger
            </p>
          </div>
          <img src="https://picsum.photos/1200/1200" className="w-full h-80 object-cover my-10" alt="background" />
          <img src="https://picsum.photos/1400/1300" className="w-full h-72 object-cover my-10" alt="background" />
          <img src="https://picsum.photos/1100/1200" className="w-full h-96 object-cover my-10 mb-96" alt="background" />
        </div>

        <LiquidGlass
          displacementScale={displacementScale}
          blurAmount={blurAmount}
          saturation={saturation}
          aberrationIntensity={aberrationIntensity}
          elasticity={elasticity}
          cornerRadius={cornerRadius}
          mouseContainer={containerRef}
          overLight={userInfoOverLight}
          mode={userInfoMode}
          style={{
            position: "fixed",
            top: "25%",
            left: "40%",
          }}
        >
          <div className="w-72 text-shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">User Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-black/10 backdrop-blur rounded-full flex items-center justify-center font-semibold">JD</div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm">Software Engineer</p>
                </div>
              </div>
              <div className="pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Email:</span>
                  <span className="text-sm">john.doe@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Location:</span>
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Joined:</span>
                  <span className="text-sm">March 2023</span>
                </div>
              </div>
            </div>
          </div>
        </LiquidGlass>
      </div>

      {/* Right Panel - Control Panel */}
      <div className="row-start-2 md:row-start-auto md:col-start-3 bg-gray-900/80 h-full overflow-y-auto backdrop-blur-md border-l border-white/10 p-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Liquid Glass Card</h2>
          <p className="text-white/60 text-sm">Use the controls below to see the effect.</p>
        </div>

        <div className="space-y-8 flex-1">
          <div>
            <span className="block text-sm font-semibold text-white/90 mb-3">Refraction Mode</span>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="userInfoModeStandard"
                  name="userInfoMode"
                  value="standard"
                  checked={userInfoMode === "standard"}
                  onChange={(e) => setUserInfoMode(e.target.value as "standard")}
                  className="w-4 h-4 accent-blue-500"
                />
                <label htmlFor="userInfoModeStandard" className="text-sm text-white/90">
                  Standard
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="userInfoModePolar"
                  name="userInfoMode"
                  value="polar"
                  checked={userInfoMode === "polar"}
                  onChange={(e) => setUserInfoMode(e.target.value as "polar")}
                  className="w-4 h-4 accent-blue-500"
                />
                <label htmlFor="userInfoModePolar" className="text-sm text-white/90">
                  Polar
                </label>
              </div>
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-white/90 mb-3">Displacement Scale</span>
            <div className="mb-2">
              <span className="text-xl font-mono text-blue-300">{displacementScale}</span>
            </div>
            <input type="range" min="0" max="200" step="1" value={displacementScale} onChange={(e) => setDisplacementScale(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <span className="block text-sm font-semibold text-white/90 mb-3">Blur Amount</span>
            <div className="mb-2">
              <span className="text-xl font-mono text-blue-300">{blurAmount.toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={blurAmount} onChange={(e) => setBlurAmount(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <span className="block text-sm font-semibold text-white/90 mb-3">Corner Radius</span>
            <div className="mb-2">
              <span className="text-xl font-mono text-blue-300">{cornerRadius}</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={cornerRadius} onChange={(e) => setCornerRadius(Number(e.target.value))} className="w-full" />
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="userInfoOverLight"
              checked={userInfoOverLight}
              onChange={(e) => setUserInfoOverLight(e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <label htmlFor="userInfoOverLight" className="text-sm text-white/90">
              Over Light Background
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
