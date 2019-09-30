import React, { useState} from 'react'
import DashPokemon from './DashPokemon/DashPokemon'
import FetchPokemon from '../../hooks/FetchPokemon'

const Dashboard = (props) => {
  const [range, setRange] = useState([0, 49])
  
  const data = FetchPokemon({pokemon: [], max: 0}, range[0], range[1])

  return (
    <div className='Dashboard'>
      <div className="pokemon-list-hold">
        {data.pokemon.length > 0 ? data.pokemon.map(element => (
          <DashPokemon key={element.info.id} data={element} />
        )) : <p>Loading</p>}
      </div>
      <div className="list-button-hold">
        <button
          disabled={range[0] <= 0 || data.pokemon.length === 0}
          onClick={() => setRange([range[0] - 50, range[1] - 50])}
        >Prev
        </button>
        <button
          disabled={range[1] > data.max || data.pokemon.length === 0}
          onClick={() => setRange([range[0] + 50, range[1] + 50])}
        >Next
      </button>
      </div>
    </div>
  )
}
export default Dashboard
