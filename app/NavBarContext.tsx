import { createContext } from 'react'

interface NavBarContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const defaultNavBarValue: NavBarContextType = {
  isOpen: false,
  setIsOpen: () => {}
}

const NavBarContext = createContext<NavBarContextType>(defaultNavBarValue)
export default NavBarContext
