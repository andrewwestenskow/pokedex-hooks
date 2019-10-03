import React from 'react'
import {Link} from 'react-router-dom'


const PageButtons = (props) => {
  const numPages = Math.ceil(props.max / props.perPage)
  const pageButtons = []
  let background
  for(let i = 1; i <= numPages; i++){
    if(i === +props.current){
      background = 'current-page'
    } else {
      background = undefined
    }
    pageButtons.push(
      <Link 
      to={`/cards/page/${i}`} 
      key={i} 
      className={`page-button ${background}`}>{i}</Link>
    )
  }
  return (
    <div className='list-button-hold'>
      {pageButtons}
    </div>
  )
}
export default PageButtons
