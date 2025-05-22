import Image from 'next/image'

import menu from '@/public/fi-rr-menu-burger.svg'
const MenuBurgerIcon = (): React.ReactNode => {
  return (
    <Image src={menu} alt='menu' priority />
  )
}

export default MenuBurgerIcon
