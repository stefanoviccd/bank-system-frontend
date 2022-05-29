import React from 'react'
import "./error.css"

function Error() {
  return (
    <div className='error-div'>
        <img className='error-img' src='../images/erorr.png'></img>
        <p>Pristup nije dozvoljen neautentifikovanim korisnicima.</p>
    </div>
  )
}

export default Error