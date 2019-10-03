import {useState, useEffect} from 'react'
import axios from 'axios'

const FetchPokemon = (initialData, page, perPage) => {
  const [data, setData] = useState(initialData)
  // const [range, setRange] = useState(initialData)
  const start = ((page - 1) * perPage)
  const end = (start + (perPage - 1))
  console.log(`START: ${start} END: ${end}`)
  useEffect(() => {
    setData({pokemon: [], max: 0})
    axios.get(`/api/pokemon?start=${start}&end=${end}`).then(res => {
      let maxPage = Math.ceil(res.data.max / perPage)
      if(page > maxPage){
        console.log('BAD BOY')
      }
      console.log(res)
      setData(res.data)
    }).catch(err => {
      console.log(err)
    })
  }, [page, perPage, start, end])
  return data
}

export default FetchPokemon