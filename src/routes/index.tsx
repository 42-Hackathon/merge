import { useEffect, useState, useRef } from 'react';
import LiquidGlass from 'liquid-glass-react';
import { supabase } from '../lib/supabase';

export default function Index() {
  // User Info Card Controls
  const [displacementScale, setDisplacementScale] = useState(100)
  const [blurAmount, setBlurAmount] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [aberrationIntensity, setAberrationIntensity] = useState(0)
  const [elasticity, setElasticity] = useState(0)
  const [cornerRadius, setCornerRadius] = useState(32)
  const [userInfoOverLight, setUserInfoOverLight] = useState(false)
  const [userInfoMode, setUserInfoMode] = useState<"standard" | "polar" | "prominent" | "shader">("shader")

  // Log Out Button Controls
  const [logoutDisplacementScale, setLogoutDisplacementScale] = useState(64)
  const [logoutBlurAmount, setLogoutBlurAmount] = useState(0.1)
  const [logoutSaturation, setLogoutSaturation] = useState(130)
  const [logoutAberrationIntensity, setLogoutAberrationIntensity] = useState(2)
  const [logoutElasticity, setLogoutElasticity] = useState(0.35)
  const [logoutCornerRadius, setLogoutCornerRadius] = useState(100)
  const [logoutOverLight, setLogoutOverLight] = useState(false)
  const [logoutMode, setLogoutMode] = useState<"standard" | "polar" | "prominent" | "shader">("standard")

  // Shared state
  const [activeTab, setActiveTab] = useState<"userInfo" | "logOut">("userInfo")
  const containerRef = useRef<HTMLDivElement>(null)

    
  const [instruments, setInstruments] = useState<any[]>([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data } = await supabase.from('instruments').select();
    if (data) {
      setInstruments(data);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <img src="https://picsum.photos/seed/glass1/1200/900" className="w-full h-full object-cover" />
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
        style={{ position: 'fixed', top: '50%', left: '50%' }}
      >
        <div className="p-6 w-72">
          <h2>Your content here</h2>
          <p>This will have the liquid glass effect</p>
        </div>
      </LiquidGlass>

      {/* <h2>Supabase Data:</h2>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>{instrument.name}</li>
        ))}
      </ul> */}
    </div>
  );
}
