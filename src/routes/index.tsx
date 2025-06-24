import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Index() {
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
    <div>
      <p id="zero-state">
        This is the home page.
      </p>
      <h2>Supabase Data:</h2>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>{instrument.name}</li>
        ))}
      </ul>
    </div>
  );
}
