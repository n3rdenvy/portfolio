/* Context module: provider + hook (react-refresh expects components-only files). */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';

const NavDepthContext = createContext({
  homePanelDepth: 0,
  setHomePanelDepth: () => {},
});

export function NavDepthProvider({ children }) {
  const [homePanelDepth, setHomePanelDepth] = useState(0);
  const value = useMemo(() => ({ homePanelDepth, setHomePanelDepth }), [homePanelDepth]);
  return <NavDepthContext.Provider value={value}>{children}</NavDepthContext.Provider>;
}

export function useNavDepth() {
  return useContext(NavDepthContext);
}
