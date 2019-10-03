const getWeight = (weight) => {
const pounds = Math.round((+weight / 4.536))
return `${pounds} lbs.`
}

export default getWeight