import './App.css';
import HomeComponent from './components/home/HomeComponent';
import NavbarComponent from './components/navbar/NavbarComponent';
import ListLegalEntityComponent from './components/ListLegalEntityComponent';
import FooterComponent from './components/FooterComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddEntityComponent from './components/addEntity/AddEntityComponent';
import Login from './components/login/Login';
import { useEffect, useState } from 'react';
import ListReportsComponent from './components/reports/ListReportsComponent';
import AddReportComponent from './components/addReport/AddReportComponent';
import CreditBureauReporsService from './services/CreditBureauReporsService';
import LegalEntityService from './services/LegalEntityService';
import NotFound from './components/notFound/NotFound';
import Error from './components/errorPage/Error';
import UserService from './services/UserService';

function App() {
  
const [reports, setReports] = useState([]);
const [legalEntities, setLegalEntities] = useState([]);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [openModal, setOpenModal]=useState(false);
const[sessionExpire, setSessionExpired]=useState(false);


const isSessionExpired=function(){
  const currentDate=new Date();
  const tokenExpirationDate=new Date(localStorage.getItem("expiration"));
  if(currentDate>tokenExpirationDate){
    setSessionExpired(true)
   return true;
  }
  else{
    setSessionExpired(false)
    return false;
  }
}
useEffect(() => {
  if(isLoggedIn){
    if(isSessionExpired())
    setOpenModal(true)
  }
});

const getAllReports = () => {
  CreditBureauReporsService.getAllReports().then((response) => {
    if(response.data.responseException==null){
        setReports(response.data.responseData)
    }
    else{
      console.log(response.data.responseException);
      setReports([])
    }
    
  }).catch(error => {
      console.log("Greska u metodi: " + error);
      setReports([])
  }) 
}
const getReportsByValue = (value) => {
  CreditBureauReporsService.getReportsByValue(value).then((response) => {
      setReports(response.data.responseData);

  }).catch(error => {
    console.log(error)
  })

}

    const getAllEntities = () => {
        LegalEntityService.getAllEntities().then((response) => {
          if(response.data.responseException==null){
                setLegalEntities(response.data.responseData)
          }
          else{
            setLegalEntities([])
          }
        }).catch(error => {
            console.log(error);
        })
    }
    const getLegalEntitiesByValue = (value) => {
      LegalEntityService.getLegalEntitiesByValue(value).then((response) => {
        if(response.data.responseException==null)
         setLegalEntities(response.data.responseData);
         else{
          setLegalEntities([]);
         }
      }).catch(error => {
        console.log("error")
          console.log(error)
      })

  }
  const reloadSession=function(){
    const username=window.localStorage.getItem("username");
    const password=window.localStorage.getItem("password");
    console.log(username)
    console.log(password)
    const user = {
      username: username,
      password: password,
    };
    UserService.login(user)
      .then((response) => {
        if (response.data.responseException == null) {
          login();
          console.log("RESPONSE")
          console.log(response)
          window.localStorage.setItem("token", response.data.jwtToken)
          window.localStorage.setItem("expiration", new Date(response.data.expirationDate))
          window.localStorage.setItem("username", username )
          window.localStorage.setItem("password", password)        
          setOpenModal(false)
  
        
        }
      })
      .catch((error) => {
        console.log(error);
      });
  
    

  }
  const logoutAndRedirectToHome=function(e){
    e.preventDefault();
    logout();
    setOpenModal(false)

  }


  useEffect(() => {
    setIsLoggedIn(JSON.parse(window.localStorage.getItem('isLoggedIn')));
    

  }, []);

  useEffect(() => {
    window.localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  function login() {
    setIsLoggedIn(true);
 

  }
  function logout() {
    setIsLoggedIn(false);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expiration");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");

  }
  return (
    <div className='main-div'>
      <BrowserRouter>
        <NavbarComponent isLoggedIn={isLoggedIn} logout={logout}></NavbarComponent>
        <Routes>
          <Route path='/' element={<HomeComponent isLoggedIn={isLoggedIn}></HomeComponent>}></Route>
          <Route path='/prijava' element={<Login login={login}></Login>}></Route>
          <Route path='/pravnaLica' element={isLoggedIn ? <ListLegalEntityComponent legalEntities={legalEntities} getAllEntities={getAllEntities} getLegalEntitiesByValue={getLegalEntitiesByValue}></ListLegalEntityComponent> : <Error></Error>}> </Route>
          <Route path='/izvestaji' element={isLoggedIn ? <ListReportsComponent reports={reports} getAllReports={getAllReports} getReportsByValue={getReportsByValue}></ListReportsComponent> : <Error></Error>}> </Route>
          <Route path="/izvestaji/novo" element={ isLoggedIn ? <AddReportComponent  getAllReports={getAllReports} legalEntities={legalEntities} getAllEntities={getAllEntities}></AddReportComponent> : <Error></Error>}> </Route>
          <Route path="/izvestaji/:id" element={ isLoggedIn ?<AddReportComponent  getAllReports={getAllReports} legalEntities={legalEntities} getAllEntities={getAllEntities} ></AddReportComponent> : <Error></Error>}> </Route>
          <Route path="/pravnaLica/novo" element={isLoggedIn ? <AddEntityComponent getAllEntities={getAllEntities}></AddEntityComponent> : <Error></Error>}> </Route>
          <Route path="/pravnaLica/novo/:id" element={ isLoggedIn ?<AddEntityComponent></AddEntityComponent> : <Error></Error>}> </Route>
          <Route path="/*" element={<NotFound></NotFound>}> </Route>
     
        </Routes>
        <FooterComponent></FooterComponent>
      </BrowserRouter>
      {openModal===true ? <>
      <div className="whole-page-layer">
    <div className="sessionExpiredDiv" id="sessionExpiredDiv">
      Vaša sesija je istekla. 
      <div className="session-buttons"> <button className="session-btn" onClick={(e)=>logoutAndRedirectToHome(e)}>OK</button>
      <button className="session-btn" onClick={(e)=>reloadSession(e)}>Obnovi</button></div>
     </div>
      </div></> : <></>}
    </div>
  );
}

export default App;
