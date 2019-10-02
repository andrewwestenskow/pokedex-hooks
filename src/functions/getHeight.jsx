const getHeight = (height) => {
  const convert = (+height * 0.328084).toFixed(2)
  const dot = convert.indexOf('.')
  let feet = convert.slice(0,dot)
  let inches = Math.round(((+convert.slice(dot,Infinity) * 12) / 1))
  if(+inches === 12){
    inches = 0
    feet = +feet + 1
  }

  if(+feet[0] === 0){
    feet = feet.slice(1, Infinity)
  }
  const newHeight = `${feet}' ${inches}"`
  return newHeight
}

export default getHeight