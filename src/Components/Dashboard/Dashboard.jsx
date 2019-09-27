import React, { useState } from 'react'
import useAxios from '../../hooks/useAxios'
import DashPokemon from './DashPokemon/DashPokemon'

const Dashboard = (props) => {

  const [range, setRange] = useState([35,64])

  const queries = [{query: 'start', value: range[0]}, {query: 'end', value: range[1]}]

  const data = useAxios('/api/pokemon', 'get', null, [], '', queries)
  const pokemon = data.map(element => (
  <DashPokemon key={element.info.id} data={element} />
  ))

  return (
    <div>
      {data && pokemon}
    </div>
  )
}
export default Dashboard
