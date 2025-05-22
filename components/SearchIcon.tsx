import Image from 'next/image'

import search from '@/public/fi-rr-search.svg'
const SearchIcon = (): React.ReactNode => {
  return (
    <Image className='absolute left-4 top-4' src={search} alt='search' priority />
  )
}

export default SearchIcon
