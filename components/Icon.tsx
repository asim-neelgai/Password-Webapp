import Image from 'next/image'
import lock from 'public/fi-rr-lock.svg'

interface Props {
  name: string
  className?: string
}
const Icon = ({ name, className = '' }: Props): React.ReactNode => {
  try {
    const iconImage = require(`@/public/${name}.svg`)

    return (
      <Image src={iconImage} alt='icon' priority className={className} />
    )
  } catch (error) {
    return <Image src={lock} alt='fallback' priority />
  }
}

export default Icon
