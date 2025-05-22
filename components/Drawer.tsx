import Icon from './Icon'

interface DrawerProps {
  drawerOpen: boolean
  title: React.ReactNode
  width?: string
  showBackArrow?: boolean
  children: React.ReactNode
  handleClose: () => void
  backArrow?: boolean
  handleBackClick?: () => void
  fromLeftNav?: boolean
}

const Drawer = ({ drawerOpen, title, width, showBackArrow = false, children, handleClose, backArrow = false, handleBackClick, fromLeftNav = false }: DrawerProps): React.ReactNode => {
  if (!drawerOpen) {
    return null
  }

  return (
    <div className={`${width}  bg-white overflow-hidden ${fromLeftNav ? 'drawer' : 'drawer-end'}  drawer z-10 `}>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' checked={drawerOpen} />
      <div className='drawer-side overflow-hidden'>
        <button aria-label='close sidebar' className='drawer-overlay' onClick={handleClose} />

        <div className={`${width} min-h-full  ${fromLeftNav ? 'bg-blue-800' : 'bg-white'} overflow-hidden `}>
          {
            !fromLeftNav && (
              <div className='flex justify-between items-center mx-8'>
                {showBackArrow && (
                  <button className='drawer-button' onClick={handleClose}>
                    <Icon name='arrow-back' />
                  </button>
                )}
                {backArrow
                  ? (
                    <div className='flex flex-row items-center justify-between w-full'>
                      <div className='flex items-center gap-4'>
                        <button className='drawer-button' onClick={handleBackClick}>
                          <Icon name='arrow-back' />
                        </button>
                        <h1 className='my-5 text-xl font-medium'>{title}</h1>
                      </div>
                      <div className='ml-auto'>
                        <button onClick={handleClose} className='cursor-pointer'>
                          <Icon name='close' />
                        </button>
                      </div>
                    </div>

                    )
                  : (
                    <>
                      <h1 className='my-5'>{title}</h1>
                      <button onClick={handleClose}>
                        <Icon name='close' />
                      </button>
                    </>

                    )}
              </div>
              // <hr />

            )
          }
          <div className='overflow-y-auto h-[710px]' style={{ scrollbarWidth: 'thin', scrollbarColor: 'white' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Drawer
