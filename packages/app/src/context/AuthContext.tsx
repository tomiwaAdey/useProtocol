// src/context/AuthContext.tsx
import { PropsWithChildren, createContext, useContext, useState } from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>
}
