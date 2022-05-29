import React, { useEffect, useState, useParams } from 'react'
import { Link } from 'react-router-dom';
import { FaTrash } from "react-icons/fa"
import { MdMoreHoriz } from "react-icons/md"
import CreditBureauReporsService from '../../services/CreditBureauReporsService';
import { GrPowerReset } from "react-icons/gr"
import dateFormat from 'dateformat';
import {GrNext, GrPrevious} from "react-icons/gr"

const ListReportsComponent = ({reports, getAllReports, getReportsByValue}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const[checked, setChecked]=useState("ALL");
    const [currentPage, setCurrentPage]=useState(1);
    const [reportsPerPage, setReportsPerPage]=useState(10);
    
  useEffect(() => {
        getAllReports();

    }, [])
    const handleDeleteReport = (e, report) => {
        e.preventDefault();
        if (report.reportStatus == "VALIDATED") {

            showMess("errorDiv")
        }
        else {
            CreditBureauReporsService.deleteReport(report.id).then((response) => {
                if(response.data.responseException==null){
                     getAllReports()
                }
                else{
                    console.log(errorMessage);
                }
               
            }).catch(error => {
                console.log("Greska u metodi deleteReport: " + error);
            })

        }


    }
    function showMess(elementId) {
        setErrorMessage("Ne možete ukloniti izveštaj koji je validiran.")
        setTimeout(function () { setErrorMessage(null) }, 4000);

    }
    const onChangeValue=(e)=>{
        setChecked(e.target.value)
        console.log(e.target.value)
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
        const maxPageNumber=reports.length/reportsPerPage;
        if(currentPage+1>Math.ceil(maxPageNumber)) return;
        setCurrentPage(currentPage+1);
        console.log(currentPage)
        return;
      }
      const indexOfLastReport=reportsPerPage*currentPage;
      const indexOfFirstReport= indexOfLastReport-reportsPerPage;
      const currentReports=reports.slice(indexOfFirstReport, indexOfLastReport);
    return (<>

        <div className='container'>
            <h2>Evidencija o izveštajima iz kreditnog biroa</h2>
            {errorMessage && <p className="error"> {errorMessage} </p>}


        </div>
        <button type="button" class="btn btn-success"><Link className='link' to={"/izvestaji/novo"}> Dodaj izveštaj</Link></button>
        <input type="text" className='nav-right input-search' onChange={(e) => getReportsByValue(e.target.value)}></input>
        <button type="button" class="btn btn-success nav-right btn-search" onClick={() => getAllReports()}><GrPowerReset></GrPowerReset></button>
        <div className="pgn-div">
            <button onClick={(e)=>goPrevious(e)}>
            <GrPrevious></GrPrevious>
          </button>
            <button onClick={(e)=>goNext(e)}>
           <GrNext></GrNext>
          </button>
            </div>
        
        <div className='radio-buttons' onChange={(e)=>onChangeValue(e)}>
            <input type="radio" id="all" name="report-status" value="ALL" defaultChecked/>
            <label for="all">Svi</label>
            <input type="radio" id="filled" name="report-status"value="FILLED" />
            <label for="css">Popunjeni</label>
            <input type="radio" id="checked" name="report-status" value="CHECKED" />
            <label for="javascript">Provereni</label>
            <input type="radio" id="validated" name="report-status" value="VALIDATED" />
            <label for="validated">Validirani</label>
        </div>
        <div className='tbl-div'>

            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Rb.</th>
                        <th scope="col">Šifra izveštaja</th>
                        <th scope="col">Naziv banke</th>
                        <th scope="col">Datum izdavanja</th>
                        <th scope="col">Pravno lice</th>
                        <th scope="col">Status</th>
                        <th scope="col">Operacije</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        currentReports.map(
                        


                            report =>

                          

                          checked==report.reportStatus | checked=="ALL" ? <tr key={report.id}>

                                    <td>{reports.indexOf(report) + 1}</td>

                                    <td>{report.reportNum}</td>
                                    <td>{report.bankName}</td>
                                    <td>{dateFormat(report.date, "yyyy-mm-dd")}</td>
                                    <td>{report.legalEntity==null ? "null" : report.legalEntity.name}</td>
                                    <td>{report.reportStatus}</td>
                                    <td>
                                        <button className=' btn-change btn-danger' onClick={(e) => handleDeleteReport(e, report)} ><FaTrash></FaTrash></button>
                                        <button className='btn-change btn-info'><Link className='link' to={"/izvestaji/" + report.id}><MdMoreHoriz></MdMoreHoriz></Link></button>
                                    </td>

                                </tr> : <></>


                        )

                    }


                </tbody>
            </table>
        </div>

    </>

    )
}

export default ListReportsComponent