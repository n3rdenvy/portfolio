import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

const MediaPlaybackOrchestratorContext = createContext(null);

/**
 * Ensures only one portfolio media player is active at a time (e.g. two carousels on /commercials).
 */
export function MediaPlaybackOrchestratorProvider({ children }) {
  const registry = useRef(new Map());

  const register = useCallback((id, pauseFn) => {
    registry.current.set(id, pauseFn);
    return () => {
      registry.current.delete(id);
    };
  }, []);

  const claimPlayback = useCallback((id) => {
    registry.current.forEach((pauseFn, regId) => {
      if (regId !== id) {
        try {
          pauseFn();
        } catch {
          /* ignore */
        }
      }
    });
  }, []);

  const value = useMemo(() => ({ register, claimPlayback }), [register, claimPlayback]);

  return (
    <MediaPlaybackOrchestratorContext.Provider value={value}>{children}</MediaPlaybackOrchestratorContext.Provider>
  );
}

export function useMediaPlaybackOrchestrator() {
  return useContext(MediaPlaybackOrchestratorContext);
}
