import { useState, useEffect } from 'react'
import axios from 'axios'


const useAxios = (url, method = 'get', body = null, initialData = [], params = '', queries = []) => {
  const [data, setData] = useState(initialData)

  function createUrl(){
    if(!params && !queries){
      return url
    } else if (!queries) {
      return `${url}/${params}`
    } else if (!params) {
      let newUrl = `${url}?`
      for(let i = 0; i < queries.length; i++){
        newUrl = newUrl + `${queries[i].query}=${queries[i].value}&`
      }
      return newUrl
    } else {
      let newUrl = `url/${params}?`
      for(let i = 0; i < queries.length; i++){
        newUrl = newUrl + `${queries[i].query}=${queries[i].value}&`
      }
      return newUrl
    }
  }

  const newUrl = createUrl()

  useEffect(() => {
    axios(newUrl, { method, body }).then(res => {
      setData(res.data)
    }).catch(err => console.log(err))
  }, [body, method, newUrl])
  return data
}
export default useAxios
