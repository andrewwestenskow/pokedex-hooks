import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import filterList from '../../functions/filterList'
import axios from 'axios'


const Header = (props) => {
  const [perPage, setPerPage] = useState(50)
  const [search, setSearch] = useState('')
  const [list, setList] = useState([])
  const [newList, setNewList] = useState([])

  useEffect(() => {
    axios.get('/api/pokemon/list').then(res => setList(res.data))
  }, [])

  useEffect(() => {
    props.history.push(`/cards/page/${props.match.params.page || 1}?perPage=${+perPage}`)
  }, [perPage, props.history, props.match.params.page])

  const sendSearch = (e) => {
    e.preventDefault()
    console.log(search)
    setSearch('')
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    const holder = [...list]
    setNewList(filterList(holder, e.target.value))
  }

  const searchResults = newList.map(element => {
    return <li>{element.name}</li>
  })

  return (
    <div className='Header'>
      <div className='header-section'>
        <p className='header-text'>Click on a card for details - or - </p>
        <form
          onSubmit={(e) => sendSearch(e)}
          className='search-form'
        >
          <input
            type="text"
            placeholder='Search for a Pokemon'
            onChange={(e) => handleSearch(e)}
            value={search}
          />
        </form>
        <ul>
          {searchResults}
        </ul>
      </div>
      <div className='header-section'>
        <p className='header-text'>Cards per page: </p>
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
    </div>
  )
}
export default withRouter(Header)
