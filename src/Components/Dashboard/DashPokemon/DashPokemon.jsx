import React from 'react'

const DashPokemon = (props) => {
  console.log(props.data.info)
  const { info } = props.data
  return (
    <div className='DashPokemon'>
      <div className="dash-pokemon-dark-background">
        <p className="dash-pokemon-id">
          {info.id}
        </p>
        <img src={info.sprites.front_default} alt="" />
        <p className="dash-pokemon-name">
          {props.data.name}
        </p>
      </div>
    </div>
  )
}
export default DashPokemon
