'use client';
import { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: number; text: string };
const ToastCtx = createContext<{ push:(t:string)=>void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((text: string) => {
    const id = Date.now();
    setList(s => [...s, { id, text }]);
    setTimeout(() => setList(s => s.filter(x => x.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div style={{position:'fixed', right:12, bottom:12, display:'grid', gap:8}}>
        {list.map(t => (
          <div key={t.id} style={{background:'#111', color:'#fff', padding:'8px 12px', borderRadius:8, boxShadow:'0 2px 8px rgba(0,0,0,0.25)'}}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx.push;
}






