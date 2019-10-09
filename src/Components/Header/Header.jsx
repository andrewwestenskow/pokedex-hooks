import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'


const Header = (props) => {
  const [perPage, setPerPage] = useState(50)
  const [search, setSearch] = useState('')

  useEffect(() => {
    props.history.push(`/cards/page/${props.match.params.page || 1}?perPage=${+perPage}`)
  }, [perPage, props.history, props.match.params.page])

  const handleSearch = (e) => {
    e.preventDefault()
    console.log(search)
    setSearch('')
  }

  return (
    <div className='Header'>
      <form
        onSubmit={(e) => handleSearch(e)}
        className='search-form'
      >
        <input
          type="text"
          placeholder='Search for a Pokemon'
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </form>
      <select
        defaultValue="50"
        onChange={(e) => setPerPage(e.target.value)}
        className='per-page-select'
      >
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  )
}
export default withRouter(Header)
