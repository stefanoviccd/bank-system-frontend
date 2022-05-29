import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./home.css"

function Home(props) {

 
  return (
    <div className='main-info'>

      <h2 className='txt'> Dobrodošli na sajt E-banke</h2>
      {!props.isLoggedIn ? <button className='btn-prijava'><Link  className='link' to={"/prijava"}>Prijavi se</Link></button> : 
      <div className='scale-up-hor-left'>
      Podsećamo vas da je podatke kojima pristupate strogo zabranjeno deliti, osim po nalogu bezbedonosnih službi.<br>
      </br>
      Ukoliko imate pitanja, obratite se nadležnom u Vašoj ekspozituri.
     </div>}

      


    </div>

  )
}

export default Home