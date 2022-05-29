import React, { useEffect, useState } from 'react'
import LegalEntityService from '../../services/LegalEntityService'
import { useHistory, useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { validAccountNumber, validEntityName, validIdentificationNumber, validPAK, validPlaceName, validStreetName, validStreetNumber, validStreetNumberBB, validTownshipName } from "../validation/Regex.jsx"

function AddEntityComponent({ getAllEntities }) {
    const [identificationNumber, setIdentificationNumber] = useState("")
    const [name, setName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [placeName, setPlaceName] = useState("")
    const [tsZipCode, setTSZipCode] = useState("")
    const [placeTownship, setPlaceTownShip] = useState("")
    const [placeStreet, setPlaceStreet] = useState("")
    const [streetNumber, setStreetNumber] = useState(0)
    const [placeId, setPlaceId] = useState(0)
    const [townshipId, setTownshipId] = useState(0)
    const [streetId, setStreetId] = useState(0)
    const { id } = useParams();
    const nav = useNavigate();
    const [errors, setErrors] = useState(false)
    const [errorMessages, setErrorMessages] = useState("")



    const handleValidation = () => {

    }
    function showMessage() {
        setErrors(true)
        setTimeout(function () { setErrorMessages(""); setErrors(false); }, 3000);

    }
    const saveOrUpdateLegalEntity = (e) => {
        e.preventDefault();
        if (name.trim() === "" | identificationNumber.trim() === "" | accountNumber.trim() === "" | placeName.trim() === "" | placeTownship.trim() === "" | placeStreet.trim() === "" | streetNumber === 0 | tsZipCode.toString().trim() === "") {
            setErrorMessages("Morate uneti sve podatke.")
            showMessage()
            return;
        }
        var i = 0;
        name.split("").forEach(character => {
            if (!validEntityName.test(character)) {
                i++;
            }
        })

        if (i > 0) {
            setErrorMessages("Naziv pravnog lica nije ispravan.");
            showMessage()
            i = 0;
            return;
        }
        i = 0;
        identificationNumber.split("").forEach(character => {
            if (!validIdentificationNumber.test(character)) {
                i++;
            }
        })
        if (i > 0) {
            setErrorMessages("Matični broj lica nije ispravan.");
            showMessage()
            i = 0;
            return;
        }
        i = 0;
        accountNumber.split("").forEach(character => {

            if (!validAccountNumber.test(character)) {
                i++;

            }
        })

        if (i > 0) {
            setErrorMessages("Račun pravnog lica nije ispravan.");
            showMessage()
            i = 0;
            return;
        }
        i = 0;
        placeName.split("").forEach(character => {
            if (!validPlaceName.test(character)) {
                i++;
            }
        })
        if (i > 0) {
            setErrorMessages("Naziv mesta pravnog lica nije ispravan.");
            showMessage()
            i = 0;
            return;
        }
        i = 0;
        placeTownship.split("").forEach(character => {
            if (!validTownshipName.test(character)) {
                i++;
            }
        })
        if (i > 0) {
            setErrorMessages("Naziv opštine pravnog lica nije ispravan.");
            showMessage()
            i = 0;
            return;
        }
        i = 0;
            placeStreet.split("").forEach(character => {
                if (!validStreetName.test(character)) {
                    i++;
                }
            })
            if (i > 0) {
                setErrorMessages("Naziv ulice pravnog lica nije ispravan.");
                showMessage()
                i = 0;
                return;
    
            }
        if(streetNumber.toString().split("").at(0)==="0"){
            setErrorMessages("Broj iz adrese pravnog lica nije ispravan.");
            showMessage()
            return;
        }
            streetNumber.toString().split("").forEach(character => {
                if (!validStreetNumber.test(character)) {
                    i++;
                }
            })
            if (i > 0) {
    
                setErrorMessages("Broj iz adrese pravnog lica nije ispravan.");
                showMessage()
                i = 0;
                return;
            }
        var place = { name: placeName }
        var townShip = { zipCode: tsZipCode, name: placeTownship, place: place }
        var street = { streetName: placeStreet, streetNumber: streetNumber, township: townShip }
        var legalEntity = {
            identificationNumber,
            name,
            accountNumber,
            street
        }
        if (!id) {
            LegalEntityService.addLegalEntity(legalEntity).then((response) => {
                if (response.data.responseException == null) {
                     console.log("dodato pravno lice")
                getAllEntities();
                
                nav("/pravnaLica");
                }
                else{
                    setErrorMessages("Nije moguće sačuvati pravno lice. Proverite validnost unetih podataka kao i da li entitet već postoji u bazi.");
                        showMessage()
                }
               

            }).catch(error => {
            console.log(error)
            })

        }
        else {

            legalEntity = {
                identificationNumber,
                name,
                accountNumber,
                street
            }
            LegalEntityService.updateLegalEntity(id, legalEntity).then((response) => {
                if (response.data.responseException == null)  {
                    
                console.log("izmenjeno pravno lice")
                nav("/pravnaLica");
                }
                else{
                    console.log(response.data.responseException)
                }

            }).catch(error => {
                console.log(error);

            })



        }

    }
    useEffect(() => {

        LegalEntityService.getLegalEntityById(id).then((response) => {
            if(response.data.responseException==null){
                   setName(response.data.responseData.name);
            setIdentificationNumber(response.data.responseData.identificationNumber)
            setAccountNumber(response.data.responseData.accountNumber)
            setPlaceName(response.data.responseData.street.township.place.name)
            setTSZipCode(response.data.responseData.street.township.zipCode)
            setPlaceTownShip(response.data.responseData.street.township.name)
            setPlaceStreet(response.data.responseData.street.streetName)
            setStreetNumber(response.data.responseData.street.streetNumber)
            }
         
        }).catch(error =>
            console.log(error));

    }, [])
    const title = () => {
        if (!id) {
            return <h2 className="text-center text-dark mt-3">Evidentiranje pravnog lica</h2>
          
        }
        else {
            return <h2 className="text-center text-dark mt-3">Izmena podataka o pravnom licu</h2>
        }

    }

    return (
        <div className='frm-add-div'>
            <div className="container">
                <div className="row">
                    <div className="col-md-6  offset-md-3">
                        {
                            title()
                        }
                       
                        <div className="text-center mb-5 text-dark">Unesite potrebne podatke</div>
                        <h6>Napomena: Tekstualna polja popunjavati ošišanom latinicom.</h6>
                        <div className="card my-5 text-center">
                            <div className='error-messages'>
                                {errors && <p>{
                                    errorMessages}</p>}

                            </div>

                            <form className="card-body cardbody-color p-lg-7">

                                <div className="text-center">
                                    <img src="https://png.pngtree.com/png-vector/20190419/ourlarge/pngtree-vector-bank-icon-png-image_957136.jpg" className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                        width="200px" alt="profile"></img>
                                </div>
                                <div className='legalEntityData'>
                                    <div className='addressData'>
                                        <p>Osnovni podaci</p>
                                        <hr></hr>
                                        <div className="mb-3">
                                            <input type="text" className="form-control" id="name"
                                                placeholder="Pun naziv" value={name} onChange={(e) => setName(e.target.value)}></input>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control" id="identificationNumber" placeholder="Matični broj" value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)}></input>
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control" id="accountNumber" placeholder="Broj računa" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}></input>
                                        </div>
                                    </div>


                                    <div className='addressData'>
                                        <p>Podaci o sedištu</p>
                                        <hr></hr>
                                        <div className="mb-3">
                                            <input type="text" className="form-control" id="place" placeholder="Naziv mesta" value={placeName} onChange={(e) => setPlaceName(e.target.value)}></input>
                                            <input type="hidden" className="form-control"
                                                value={placeId} onLoad={(e) => setPlaceId(e.target.value)}></input>
                                        </div>
                                        <div className='townShipInfo'>
                                            <div className="mb-3">
                                                <input type="text" className="form-control" id="townShip" placeholder="Opština" value={placeTownship} onChange={(e) => setPlaceTownShip(e.target.value)}></input>
                                                <input type="hidden" className="form-control"
                                                    value={townshipId} onLoad={(e) => setTownshipId(e.target.value)}></input>
                                            </div>
                                            <div className="mb-3">
                                                <input type="text" className="form-control" id="zipCode" placeholder="PAK" value={tsZipCode} onChange={(e) => setTSZipCode(e.target.value)}></input>
                                            </div>
                                        </div>
                                        <div className='townShipInfo'>
                                            <div className="mb-3">
                                                <input type="hidden" className="form-control"
                                                    value={streetId} onLoad={(e) => setStreetId(e.target.value)}></input>
                                                <input type="text" className="form-control" id="streetName" placeholder="Ulica" value={placeStreet} onChange={(e) => setPlaceStreet(e.target.value)}></input>
                                            </div>
                                            <div className="mb-3">
                                                <input type="text" className="form-control" id="streetNum" placeholder="Broj" value={streetNumber}  onChange={(e) => setStreetNumber(e.target.value)}></input>
                                            </div>
                                        </div>




                                    </div>
                                </div>

                                <div className="text-center"><button type="submit" className="addEnttiyBtn" onClick={(e) => saveOrUpdateLegalEntity(e)}>Potvrdi</button>
                                    <button className="cancelAddingEntity"><Link className='link white' to={"/pravnaLica"}>Otkaži</Link></button>
                                </div>


                            </form>
                        </div>

                    </div>
                </div>
            </div >
        </div >
    )
}

export default AddEntityComponent