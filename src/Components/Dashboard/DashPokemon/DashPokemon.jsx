import React from 'react'


const DashPokemon = (props) => {
  return (
    <div>
      <img src={props.data.info.sprites.front_default} alt=""/>
      {props.data.name}
    </div>
  )
}
export default DashPokemon
