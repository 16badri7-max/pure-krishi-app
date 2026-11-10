import { useState, useEffect } from 'react';
import { store, AppState } from './store';

export function useStore(): { state: AppState; store: typeof store } {
  const [state, setState] = useState<AppState>(() => store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return () => unsubscribe();
  }, []);

  return { state, store };
}
