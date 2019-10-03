import React from 'react'
import getHeight from '../../../functions/getHeight'
import getWeight from '../../../functions/getWeight'
import getBackground from '../../../functions/getBackgrounds'

const DashPokemon = (props) => {
  // console.log(props.data.info)
  const { info } = props.data
  const {type} = info
  // console.log(`Name: ${props.data.name} type: ${type}`)
  
  const height = getHeight(info.height)
  const weight = getWeight(info.weight)
  const {background, setting} = getBackground(type)
  return (
    <div className='DashPokemon'>
      <div className={`dash-pokemon-dark-background ${background}`}>
        <p className="dash-pokemon-name">
          {props.data.name}
        </p>
        <div className={`dash-pokemon-profile ${setting}`}>
          <img src={info.sprites.front_default} alt="" />
        </div>
        <div className="dash-pokemon-details">
          <p>{`${type} Pokemon. Length: ${height}, Weight: ${weight}`}</p>
        </div>
      </div>
    </div>
  )
}
export default DashPokemon
