import React, { useState } from 'react'
import useAxios from '../../hooks/useAxios'
import DashPokemon from './DashPokemon/DashPokemon'

const Dashboard = (props) => {
  const [range, setRange] = useState([0, 24])

  const queries = [{ query: 'start', value: range[0] }, { query: 'end', value: range[1] }]

  const data = useAxios('/api/pokemon', 'get', null, [], '', queries)
  const pokemon = data.pokemon


  return (
    <div className='Dashboard'>
      <div className="pokemon-list-hold">
        {pokemon && pokemon.map(element => (
          <DashPokemon key={element.info.id} data={element} />
        ))}
      </div>
      <div className="list-button-hold">
        <button
          disabled={range[0] <= 0}
          onClick={() => setRange([range[0] - 25, range[1] - 25])}
        >Prev
        </button>
        <button
          disabled={range[1] > data.max}
          onClick={() => setRange([range[0] + 25, range[1] + 25])}>Next
      </button>
      </div>
    </div>
  )
}
export default Dashboard
