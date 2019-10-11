import React from 'react'
import getHeight from '../../../functions/getHeight'
import getWeight from '../../../functions/getWeight'
import getBackground from '../../../functions/getBackgrounds'

const DashPokemon = (props) => {
  // console.log(props.data.info)
  const { img, id, height, weight, type, name } = props.data
  // console.log(`Name: ${props.data.name} type: ${type}`)
  
  const useHeight = getHeight(height)
  const useWeight = getWeight(weight)
  const {background, setting} = getBackground(type)
  return (
    <div className='DashPokemon'>
      <div className={`dash-pokemon-dark-background ${background}`}>
        <p className="dash-pokemon-name">
          {name}
        </p>
        <div className={`dash-pokemon-profile ${setting}`}>
          <img src={img} alt="" />
        </div>
        <div className="dash-pokemon-details">
          <p>{`${type} Pokemon. Length: ${useHeight}, Weight: ${useWeight}`}</p>
        </div>
      </div>
    </div>
  )
}
export default DashPokemon
