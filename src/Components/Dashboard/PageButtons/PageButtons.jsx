import React from 'react'
import {Link, withRouter} from 'react-router-dom'


const PageButtons = (props) => {
  const {page} = props.match.params
  const numPages = Math.ceil(props.max / props.perPage)
  const pageButtons = []
  for(let i = 1; i <= numPages; i++){
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
export default withRouter(PageButtons)
