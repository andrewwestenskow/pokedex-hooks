import React, {useState, useEffect} from 'react'
import {withRouter} from 'react-router-dom'


const Header = (props) => {
  console.log(props.match)

  const [perPage, setPerPage] = useState(50)

  useEffect(() => {
    props.history.push(`/cards/page/${props.match.params.page || 1}?perPage=${+perPage}`)
  }, [perPage])

  return (
    <div className='Header'>
      <select defaultValue="50" onChange={(e) => setPerPage(e.target.value)}>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  )
}
export default withRouter(Header)
