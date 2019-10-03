import React from 'react'
import {Link} from 'react-router-dom'

const PageButtons = (props) => {
  const pageButtons = []
  for(let i = 1; i <= props.numPages; i++){
    pageButtons.push(
      <Link to={`/cards/page/${i}`} key={i} className='page-button'>{i}</Link>
    )
  }
  return (
    <div className='list-button-hold'>
      {pageButtons}
    </div>
  )
}
export default PageButtons
