import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  handlePageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, totalItems, pageSize, handlePageChange }: PaginationProps): React.ReactElement => {
  const renderPageButtons = (): JSX.Element[] => {
    const pageButtons = []
    const totalPages = Math.ceil(totalItems / pageSize)
    const maxVisiblePages = 5
    const halfVisiblePages = Math.floor(maxVisiblePages / 2)

    const startPage = Math.max(1, currentPage - halfVisiblePages)
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (startPage > 1) {
      pageButtons.push(
        <button className='btn btn-xs' key={1} onClick={() => handlePageChange(1)}>
          1
        </button>
      )
      if (startPage > 2) {
        pageButtons.push(<span key='ellipsis1'>...</span>)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'btn btn-primary rounded-none btn-sm' : 'btn btn-sm rounded-none'}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key='ellipsis2'>...</span>)
      }
      pageButtons.push(
        <button className='btn btn-sm' key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </button>
      )
    }

    return pageButtons
  }

  return (
    <div className='flex justify-end'>
      <button className='btn btn-sm rounded-r-sm' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>«</button>
      {renderPageButtons()}
      <button className='btn btn-sm rounded-l-sm' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>»</button>
    </div>
  )
}

export default Pagination
