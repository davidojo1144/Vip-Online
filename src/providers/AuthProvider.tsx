import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { loadAuthToken } from '@/lib/api';

type AuthContextType = {
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await loadAuthToken();
      setLoaded(true);
    })();
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: !!token }),
    [token]
  );

  if (!loaded) return null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
