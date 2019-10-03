const getBackgrounds = (type) => {
  let background
  let setting
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
  switch (type) {
    case 'dark':
      setting = 'darkbg'
      break;
    case 'dragon':

      break;
    case 'fairy':

      break;
    case 'fighting':
      break;
    case 'flying':
      break;
    case 'ground':
    case 'rock':
      setting = 'groundbg'
      break;

    case 'fire':

      break;
    case 'grass':
    case 'poison':
      break;
    case 'bug':

      break;
    case 'normal':

      break;
    case 'psychic':
    case 'ghost':

      break;
    case 'steel':

      break;
    case 'electric':

      break;
    case 'water':
      break;
    case 'ice':

      break;
    default:

      break;
  }

  return { background, setting }
}

export default getBackgrounds