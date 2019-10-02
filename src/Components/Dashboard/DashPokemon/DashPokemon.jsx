import React from 'react'
import getHeight from '../../../functions/getHeight'

const DashPokemon = (props) => {
  // console.log(props.data.info)
  const { info } = props.data
  const {type} = info
  // console.log(`Name: ${props.data.name} type: ${type}`)
  let background
  switch (type) {
    case 'dark':
      background = 'dark'
      break;
    case 'dragon':
      background = 'dragon'
      break;
    case 'fairy':
      background = 'fairy'
      break;
    case 'fighting':
    case 'flying':
    case 'ground':
    case 'rock':
      background = 'fighting'
      break;
    case 'fire':
      background = 'fire'
      break;
    case 'grass':
    case 'poison':
    case 'bug':
      background = 'grass'
      break;
    case 'normal':
      background = 'normal'
      break;
    case 'psychic':
    case 'ghost':
      background = 'psychic'
      break;
    case 'steel':
      background = 'steel'
      break;
    case 'electric':
      background = 'thunder'
      break;
    case 'water':
    case 'ice':
      background = 'water'
      break;
    default:
      background = 'normal'
      break;
  }
  const height = getHeight(info.height)
  return (
    <div className='DashPokemon'>
      <div className={`dash-pokemon-dark-background ${background}`}>
        <p className="dash-pokemon-name">
          {props.data.name}
        </p>
        <div className="dash-pokemon-profile">
          <img src={info.sprites.front_default} alt="" />
        </div>
        <div className="dash-pokemon-details">
          <p>{height}</p>
          {/* <p>{info.weight}</p> */}
        </div>
      </div>
    </div>
  )
}
export default DashPokemon
