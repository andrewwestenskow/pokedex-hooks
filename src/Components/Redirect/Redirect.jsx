import React from 'react'


const Redirect = (props) => {
  props.history.push('/cards/page/1?perPage=50')
  return <></>
}
export default Redirect
