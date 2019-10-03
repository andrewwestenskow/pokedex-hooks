import {useState, useEffect} from 'react'

const GetRange = (initialData, page, perPage) => {
  const [range, setRange] = useState(initialData)
  const min = ((page - 1) * perPage)
  const max = (min + (perPage - 1))
  useEffect(() => {
    setRange([min, max])
  }, [page, perPage, max, min])
  return range
}

export default GetRange

/*
! PAGE 1      2       3       4       5       6
*100  0-99 100-199 200-299 300-399 400-499 500-599
*50   0-49  50-99  100-199 200-249 250-299 300-349
*25   0-24  25-50   51-75   76-100 125-150 151-175
*/