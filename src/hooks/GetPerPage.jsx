import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GetPerPage = (initialData) => {
  const [perPage, setPerPage] = useState(initialData)
  const urlQuery = new URLSearchParams(useLocation().search)
  const num = urlQuery.get('perPage')
  let result

  if(+num < 35){
    result = 25
  } else if (+num >= 35 && +num < 75){
    result = 50
  } else if (+num >= 75 && +num <= 100){
    result = 100
  } else {
    result = 50
  }
  useEffect(() => {
    setPerPage(result)
  }, [perPage, initialData, num, result])
  return +perPage
}

export default GetPerPage