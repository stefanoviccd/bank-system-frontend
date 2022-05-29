import React, { useEffect, useState, useParams } from 'react'
import { Link } from 'react-router-dom';
import LegalEntityService from '../services/LegalEntityService';
import { FaTrash } from "react-icons/fa"
import {GrPowerReset} from "react-icons/gr"
import {GrNext, GrPrevious} from "react-icons/gr"

const ListLegalEntityComponent = ({legalEntities, getAllEntities, getLegalEntitiesByValue}) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage]=useState(1);
    const [entitiesPerPage, setEntitiesPerPage]=useState(15);
    function showMess(elementId, message) {
        setErrorMessage(message);
        setTimeout(function () { setErrorMessage(null) }, 4000);

    }

    useEffect(() => {
        getAllEntities();

    }, [])


    const deleteLegalEntity = (entityId) => {
        LegalEntityService.deleteLegalEntity(entityId).then((response) => {
            if(response.data.responseException==null)
            getAllEntities()
            else{
                console.log(response.data.responseException)
            }
        }).catch(error => {
            console.log(error)

        })

    }
    const goPrevious=function(e){
        e.preventDefault();
        if(currentPage===1) return;
        else{
          setCurrentPage(currentPage-1)
          console.log(currentPage)
      
        }
      }
      const goNext=function(e){
        e.preventDefault();
        const maxPageNumber=legalEntities.length/entitiesPerPage;
        if(currentPage+1>Math.ceil(maxPageNumber)) return;
        setCurrentPage(currentPage+1);
        console.log(currentPage)
        return;
      }
      const indexOfLastEntity=entitiesPerPage*currentPage;
      const indexOfFirstEntity= indexOfLastEntity-entitiesPerPage;
      const currentEntities=legalEntities.slice(indexOfFirstEntity, indexOfLastEntity);

    return (<>
        <div className='container'>
            <h2>Evidencija o pravnim licima</h2>
            {errorMessage && <p className="error"> {errorMessage} </p>}
        </div>
        <button type="button" class="btn btn-success"><Link className='link' to={"/pravnaLica/novo"}> Dodaj pravno lice</Link></button>
        <input type="text" className='nav-right input-search' onChange={(e)=>getLegalEntitiesByValue(e.target.value)}></input>
        <button type="button" class="btn btn-success nav-right btn-search" onClick={()=>getAllEntities()}><GrPowerReset></GrPowerReset></button>
        <div className="pgn-div">
            <button onClick={(e)=>goPrevious(e)}>
            <GrPrevious></GrPrevious>
          </button>
            <button onClick={(e)=>goNext(e)}>
           <GrNext></GrNext>
          </button>
            </div>
        <div className='tbl-div'>

            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Rb.</th>
                        <th scope="col">Matični broj</th>
                        <th scope="col">Puno ime</th>
                        <th scope="col">Broj računa</th>
                        <th scope="col">Sedište</th>
                        <th scope="col">Operacije</th>
                    </tr>
                </thead>
                <tbody>
                    {   
                        currentEntities.map(
                            
                          
                            entity =>
                        
                                 <tr key={entity.id}>
                     
                                <td>{legalEntities.indexOf(entity)+1}</td>
                          
                                <td>{entity.identificationNumber}</td>
                                <td>{entity.name}</td>
                                <td>{entity.accountNumber}</td>
                                <td>{entity.street.streetName+" "+entity.street.streetNumber+ ", "+entity.street.township.place.name+" "+entity.street.township.zipCode+" "
                                +entity.street.township.name
        
                                }</td>
                                <td>
                                    <button className=' btn-change btn-danger'  onClick={() => deleteLegalEntity(entity.id)}><FaTrash></FaTrash></button>
                                    <button className='btn-change btn-info'><Link className='link' to={"/pravnaLica/novo/" + entity.id}>Izmeni</Link></button>
                                </td>

                            </tr>
                            
             
                        )
                        
                    }
                
                    
                </tbody>
            </table>
        </div>

    </>

    )
}

export default ListLegalEntityComponent