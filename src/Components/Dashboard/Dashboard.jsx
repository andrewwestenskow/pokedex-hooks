import React, { useState} from 'react'
import DashPokemon from './DashPokemon/DashPokemon'
import FetchPokemon from '../../hooks/FetchPokemon'
import PageButtons from './PageButtons/PageButtons'

const Dashboard = (props) => {
  const [range, setRange] = useState([0, 99])
  
  const data = FetchPokemon({pokemon: [], max: 0}, range[0], range[1])

  const numPages = Math.ceil(data.max / 50)

  return (
    <div className='Dashboard'>
      <div className="pokemon-list-hold">
        {data.pokemon.length > 0 ? data.pokemon.map(element => (
          <DashPokemon key={element.info.id} data={element} />
        )) : <p>Loading</p>}
      </div>
        <PageButtons
        range={range}
        setRange={setRange}
        numPages={numPages}
        max={data.max}
        />
    </div>
  )
}
export default Dashboard
