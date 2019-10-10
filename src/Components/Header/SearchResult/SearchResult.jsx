import React from 'react'
import { Link } from 'react-router-dom'

const SearchResult = (props) => {
  return (
    <Link className='Link'  to={`/pokemon/${props.name}`}>
      <ul className='Search-Result'>{props.name}</ul>
    </Link>
  )
}
export default SearchResult
