
'use client';
import { useState } from 'react';

const MODELS = {
  ford: {
    Ranger: ['Raptor', 'Wildtrak'],
    Falcon: ['XR6', 'XR6 Turbo', 'XR8']
  },
  tesla: {
    'Model 3': ['Performance', 'Long Range']
  }
};

export default function Page() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [badge, setBadge] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const models = make ? Object.keys(MODELS[make as keyof typeof MODELS] || {}) : [];
  const badges = model ? MODELS[make as keyof typeof MODELS][model as any] || [] : [];

  const handleSubmit = async () => {
    const text = file ? await file.text() : '';
    const res = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ make, model, badge, log: text })
    });
    alert(JSON.stringify(await res.json(), null, 2));
  };

  return (
    <div>
      <h1>Vehicle Form</h1>

      <select value={make} onChange={e => { setMake(e.target.value); setModel(''); setBadge(''); }}>
        <option value="">Select Make</option>
        {Object.keys(MODELS).map(m => <option key={m}>{m}</option>)}
      </select>

      <select value={model} onChange={e => { setModel(e.target.value); setBadge(''); }}>
        <option value="">Select Model</option>
        {models.map(m => <option key={m}>{m}</option>)}
      </select>

      <select value={badge} onChange={e => setBadge(e.target.value)}>
        <option value="">Select Badge</option>
        {badges.map(b => <option key={b}>{b}</option>)}
      </select>

      <input type="file" accept=".txt" onChange={e => setFile(e.target.files?.[0] || null)} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
