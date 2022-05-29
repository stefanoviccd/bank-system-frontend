import React from 'react'
import { FaTrash } from "react-icons/fa"
import { BsSave } from "react-icons/bs"
import { MdCancel } from "react-icons/md"
import { AiOutlineEdit } from "react-icons/ai"
import dateFormat from 'dateformat'
import {MdOutlineNearMeDisabled} from  "react-icons/md"

function ReadOnlyRow({ loan, deleteLoan, editable, handleUpdateClick }) {
    return (
        <>
            <tr key={loan.id}>

                <th scope="row" >{loan.serialNum}</th>
                <td>{loan.amount}</td>
                <td >{dateFormat(loan.dateOfApproval, "yyyy-mm-dd")}</td>
                <td >{dateFormat(loan.startDate, "yyyy-mm-dd")}</td>
                <td >{dateFormat(loan.endDate, "yyyy-mm-dd")}</td>
                <td >{loan.rateAmount}</td>
                <td >{loan.rateNumber}</td>
                <td >{loan.debt}</td>
                <td>
                  {
                      editable ? <>
                      <button className='btn-update-loan' type='button' onClick={(e)=>handleUpdateClick(e, loan)}  ><AiOutlineEdit></AiOutlineEdit></button>
                    <button className='btn-cancel' onClick={(e) => deleteLoan(e, loan.serialNum)} ><FaTrash></FaTrash></button></>
                            :
                            <>
                              <button className='' disabled  >
                                 <MdOutlineNearMeDisabled></MdOutlineNearMeDisabled></button></>
                          
                  }  
                </td>

            </tr>
        </>
    )
}

export default ReadOnlyRow