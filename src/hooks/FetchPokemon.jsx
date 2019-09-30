import {useState, useEffect} from 'react'
import axios from 'axios'

const FetchPokemon = (initialData, start, end) => {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    setData({pokemon: [], max: 0})
    axios.get(`/api/pokemon?start=${start}&end=${end}`).then(res => {
      console.log(res)
      setData(res.data)
    }).catch(err => console.log(err))
  }, [start, end])
  return data
}

export default FetchPokemon