import React from 'react'
import DashPokemon from './DashPokemon/DashPokemon'
import FetchPokemon from '../../hooks/FetchPokemon'
import PageButtons from './PageButtons/PageButtons'

const Dashboard = (props) => {  
  const data = FetchPokemon({pokemon: [], max: 0}, props.match.params.page, 50)
  if(data.pokemon.length === 0 && data.max !== 0){
    props.history.push(`/cards/page/${data.max}`)
  }
  return (
    <div className='Dashboard'>
      <div className="pokemon-list-hold">
        {data.pokemon.length > 0 ? data.pokemon.map(element => (
          <DashPokemon key={element.info.id} data={element} />
        )) : <p>Loading</p>}
      </div>
        <PageButtons
        perPage={50}
        max={data.max}
        current={props.match.params.page}
        />
    </div>
  )
}
export default Dashboard
