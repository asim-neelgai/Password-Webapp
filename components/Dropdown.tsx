import React, { ReactNode } from 'react'
import Icon from './Icon'
import { components } from '@/apptypes/api-schema'

interface DropdownProps {
  items: DropdownItem[]
  top: string
  width?: string
  icon: string
  id?: string
  row?: string
  data?: any
  buttonTitle?: string
  className?: string
  showIcon?: boolean
}
export interface DropdownItem {
  content: ReactNode
  icon?: ReactNode
  onClick: (id?: string, row?: string, data?: any) => void
  visibleFor: Array<components['schemas']['SecretType']>
}

const Dropdown = ({ items, icon, top = '', id, width = '', row, data, buttonTitle, className = '', showIcon }: DropdownProps): React.ReactNode => {
  return (
    <div className='dropdown sm:dropdown-end items-center'>
      {showIcon === true
        ? (
          <div tabIndex={0} role='button' className={`btn btn-ghost font-normal ${className}`}>
            {buttonTitle}
            <Icon name={icon} />
          </div>
          )
        : (
          <div tabIndex={0} role='button' className={`${className}`}>
            <Icon name={icon} />
          </div>
          )}

      <ul
        className={`dropdown-content z-[1] menu p-2 shadow bg-white w-52 rounded-lg ${top} ${width}`}
      >
        {items.map((item, index) => (
          <li key={index}>
            <button
              tabIndex={0} onClick={(): void => {
                item.onClick(id, row, data)
              }}
            >
              {item.icon !== null && <span className='mr-2'>{item.icon}</span>}
              {item.content}
            </button>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default Dropdown
