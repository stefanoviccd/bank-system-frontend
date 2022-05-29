import React from 'react'
import { MdCancel } from "react-icons/md"
import { BsSave } from "react-icons/bs"
import { useState } from 'react';
import dateFormat from 'dateformat';
function EditableRow({loan, handleCancelClick, handleSaveChangesClick, validateLoanInfo, loanError, setLoanError}) {
  const [editLoan, setEditLoan]=useState(loan);
  const setLoanAttributeValue=(e)=>{
    e.preventDefault();
    
    var newLoan={...editLoan}
   const fieldName=e.target.getAttribute("name");

   const fieldValue=e.target.value;
    newLoan[fieldName]=fieldValue;
    setEditLoan(newLoan)



  }
  const handleSaveChanges=(e, editLoan)=>{
    e.preventDefault();
    setLoanError(true)
    validateLoanInfo(editLoan);
    if(loanError==true){
     
      return;
    }
    else{
      handleSaveChangesClick(e, editLoan);
    }
  


  }

  
  return (
    <tr key={editLoan.id}>

    <th scope="row" >{editLoan.serialNum}</th>
    <td><input className='row-input' name="amount" type="text" required={true} defaultValue={editLoan.amount} onChange={(e)=>setLoanAttributeValue(e)}></input></td>
    <td ><input className='row-input' name="dateOfApproval" type="date" required={true} defaultValue={dateFormat(editLoan.dateOfApproval, "yyyy-mm-dd")} onChange={(e)=>setLoanAttributeValue(e)}></input></td>
    <th ><input className='row-input' name="startDate" type="date" required={true} defaultValue={dateFormat(editLoan.startDate, "yyyy-mm-dd")} onChange={(e)=>setLoanAttributeValue(e)}></input></th>
    <td ><input className='row-input' name="endDate" type="date" required={true} defaultValue={dateFormat(editLoan.endDate, "yyyy-mm-dd")} onChange={(e)=>setLoanAttributeValue(e)}></input></td>
    <td ><input className='row-input' name="rateAmount" type="text" required={true} defaultValue={editLoan.rateAmount} onChange={(e)=>setLoanAttributeValue(e)}></input></td>
    <td ><input className='row-input' name="rateNumber" type="text" required={true} defaultValue={editLoan.rateNumber} onChange={(e)=>setLoanAttributeValue(e)}></input></td>
    <td ><input className='row-input' name="debt" type="text" required={true} defaultValue={editLoan.debt} onChange={(e)=>setLoanAttributeValue(e)}></input></td>
    <td>
    <button className='btn-update-loan' type='button' onClick={(e)=>handleSaveChanges(e,editLoan)}  ><BsSave></BsSave></button>
                    <button className='btn-cancel' onClick={(e) => handleCancelClick(e)} ><MdCancel></MdCancel></button>
           

    </td>

</tr>
  )
}

export default EditableRow