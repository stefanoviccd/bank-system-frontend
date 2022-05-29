import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import "./login.css"
function Login(props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [errorMessage, setErrorMessage]=useState(false)
    const [messageValue, setMessageValue]=useState("Pogrešno korisničko ime ili lozinka.");
   
    const renderErrorMessage = (name) =>
        (
            <div className="error">{errorMessage && <p>{messageValue}</p>}</div>
        );
      
    const handleSubmit = (event) => {
        event.preventDefault();
        const user={
            username: username,
            password: password
        }
        UserService.login(user).then((response) => {
            setIsSubmitted(true);
            window.localStorage.setItem("token", response.data.jwtToken);
            const expirationdate=new Date(response.data.expirationDate);
            window.localStorage.setItem("expiration", expirationdate);
            window.localStorage.setItem("username", username);
            window.localStorage.setItem("password", password);
            console.log(response)
        }).catch(error => {
            if(error.response){
                if(error.response.status==404)
                setMessageValue("Pogrešno korisničko ime ili lozinka.")
                setErrorMessage(true)
                
            }
            else{
                setMessageValue("Greška u sistemu. Molimo Vas pokušajte kasnije.")
                setErrorMessage(true)
            }
            
        })
      
    };

    const renderForm = (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>E-mail</label>
                    <input type="text" name="uname" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    
                </div>
                <div className="input-container">
                    <label>Password</label>
                    <input type="password" name="pass" required  value={password} onChange={(e) => setPassword(e.target.value)} />
                    {renderErrorMessage("pass")}
                </div>
                <div className="button-container">
                    <input type="submit" />
                </div>
            </form>
        </div>
    );


    return (
        <>
            <div className="app">
                <div className="login-form">
                    <div className="title">Prijava</div>
                    {isSubmitted ? <div>Uspešno ste se prijavili!
                        <button  onClick={props.login} className=' btn go-to-home-page'><Link className='link' to="/">Nastavi na početnu stranu</Link></button>
                    </div> : renderForm}
                </div>
            </div>
        </>
    )
}

export default Login