import React from 'react'


const DashPokemon = (props) => {
  console.log(props.data.info)
  const {info} = props.data
  return (
    <div className='DashPokemon'>
      {info.id}
      <img src={info.sprites.front_default} alt=""/>
      {props.data.name}
    </div>
  )
}
export default DashPokemon
