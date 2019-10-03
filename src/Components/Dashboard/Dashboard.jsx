import React from 'react'
import DashPokemon from './DashPokemon/DashPokemon'
import FetchPokemon from '../../hooks/FetchPokemon'
import PageButtons from './PageButtons/PageButtons'
import GetRange from '../../hooks/GetRange'

const Dashboard = (props) => {  
  const range = GetRange([], props.match.params.page, 50)
  const data = FetchPokemon({pokemon: [], max: 0}, range[0], range[1])
  console.log(data)


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
        />
    </div>
  )
}
export default Dashboard
