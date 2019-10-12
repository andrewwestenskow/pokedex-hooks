import React from 'react'
import DashPokemon from './DashPokemon/DashPokemon'
import FetchPokemon from '../../hooks/FetchPokemon'
import PageButtons from './PageButtons/PageButtons'
import GetPerPage from '../../hooks/GetPerPage'

const Dashboard = (props) => {
  const perPage = GetPerPage(50)

  const data = FetchPokemon({ pokemon: [], max: 0 }, props.match.params.page, perPage)
  if (data.pokemon.length === 0 && data.max !== 0) {
    props.history.push(`/cards/page/${data.max}`)
  }

  // console.log(data.pokemon)
  // console.log(props.match)
  return (
    <div className='Dashboard'>
      <div className="pokemon-list-hold">
        {data.pokemon.length > 0 ? data.pokemon.map(element => {
          return <DashPokemon key={element.id} data={element} />
        }) : <p>Loading</p>}
      </div>
      <PageButtons
        perPage={+perPage}
        max={data.max}
        current={props.match.params.page}
      />
    </div>
  )
}
export default Dashboard
