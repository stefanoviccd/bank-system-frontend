import React, { useEffect, useState } from "react";

import ReadOnlyRow from "../readOnlyRow/ReadOnlyRow";
import EditableRow from "../editableRow/EditableRow";
import { useNavigate, useParams } from "react-router-dom";
import CreditBureauReporsService from "../../services/CreditBureauReporsService";
import dateFormat, { masks } from "dateformat";
import {
  validBankName,
  validReportNumber,
  validLoanAmount,
  validRateAmount,
  validDebt,
} from "../validation/Regex.jsx";


function AddReportComponent({ getAllReports, legalEntities, getAllEntities}) {
  const [amount, setAmount] = useState(null);
  const [dateOfApproval, setDateOfApproval] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rateAmount, setRateAmount] = useState(null);
  const [rateNumber, setRateNumber] = useState(null);
  const [debt, setDebt] = useState(null);
  const [reportDate, setReportDate] = useState(null);
  const [reportNum, setReportNum] = useState("");
  const [bankName, setBankName] = useState("");
  const [reportStatus, setReportStatus] = useState("FILLED");
  const [loans, setLoans] = useState([]);
  const { id } = useParams();
  const nav = useNavigate();
  const [serialNum, setSerialNum] = useState(loans.length + 1);
  const [editLoanNumber, setEditLoanNumber] = useState(null);
  const [editable, setEditable] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loanError, setLoanError] = useState(true);
  const [reportStatusValueChecked, setReportStatusValueChecked] =
    useState(false);
  const [reportInfoError, setReportInfoError] = useState(true);
  const[ legalEntity, setLegalEntity]=useState();

  const loadReport = () => {
    CreditBureauReporsService.getReportById(id)
      .then((response) => {
        if(response.data.responseException==null){
          setLegalEntity(response.data.responseData.legalEntity);
          setReportDate(response.data.responseData.date);
          setReportNum(response.data.responseData.reportNum);
          setBankName(response.data.responseData.bankName);
          setLoans(response.data.responseData.loans);
          setEditable(false);
          setReportStatus(response.data.responseData.reportStatus);
          if (reportStatus !== "FILLED") {
            setReportStatusValueChecked(true);
        }
     
        }
      })
      .catch((error) => console.log(error));
  };
  
  useEffect(() => {
    loadReport();
    if(!id){
       getAllEntities();

    }
    else {
      
    }
  }, []);

  const onChangeValue = (e) => {
    setReportStatus(e.target.value);
    setReportStatusValueChecked(true);
    console.log(e.target.value);
  };
  const changeLegalEntity=(entity)=>{

   legalEntities.forEach(e =>{
      if(e.id==entity){
        setLegalEntity(e);
      console.log("*******************  legal entity *********************")
        console.log(legalEntity);
        return;
      }
    })
  

  }
  function showMess() {
    setTimeout(function () {
      setErrorMessage(null);
    }, 4000);
  }
  const [editLoanData, setEditLoanData] = useState({
    serialNum: "",
    amount: "",
    dateOfApproval: "",
    startDate: "",
    endDate: "",
    rateAmount: "",
    rateNumber: "",
    debt: "",
    operation: "",
  });
  const handleSaveChangesClick = (e, updateLoan) => {
    e.preventDefault();
    const edited = loans.map((l) => {
      return l.serialNum === updateLoan.serialNum ? updateLoan : l;
    });

    setLoans(edited);
    setEditLoanNumber(null);
  };

  const title = () => {
    if (!id) {
      return (
        <h2 className="text-center text-dark mt-3 title">
          Evidentiranje izveštaja iz Kreditnog biroa
        </h2>
      );
    } else {
      return (
        <h2 className="text-center text-dark mt-3 title">
          Detalji o izveštaju iz Kreditnog biroa
        </h2>
      );
    }
  };
  const validateLoanInfo = (loan) => {
    if (
      (loan.startDate == null) |
      (loan.endDate == null) |
      (loan.dateOfApproval == null)
    ) {
      setErrorMessage("Morate uneti sva polja");
      showMess();
      return;
    }
    if ((loan.dateOfApproval > startDate) | (loan.dateOfApproval > endDate)) {
      setErrorMessage(
        "Datumi nisu validni. Datum odobrenja mora biti najraniji datum!"
      );
      showMess();
      return;
    }
    if (loan.startDate > loan.endDate) {
      setErrorMessage(
        "Datumi nisu validni. Datum početka isplate ne može biti nakon data kraja isplate!"
      );
      showMess();
      return;
    }
    if (
      (loan.amount.toString().trim() == "") |
      (loan.rateAmount.toString().trim() == "") |
      (loan.rateNumber.toString().trim() == "") |
      (loan.debt.toString().trim() == "")
    ) {
      setErrorMessage("Morate uneti sva polja.");
      showMess();
      return;
    }
    var i = 0;
    loan.amount
      .toString()
      .split("")
      .forEach((character) => {
        if (!validLoanAmount.test(character)) {
          i++;
        }
      });

    if (i > 0) {
      setErrorMessage("Iznos kredita nije ispravan.");
      showMess();
      i = 0;
      return;
    }
    if (loan.rateNumber<0) {
      setErrorMessage("Broj rata mora biti pozitivan broj.");
      showMess();
      i = 0;
      return;
    }
    i = 0;
    loan.rateAmount
      .toString()
      .split("")
      .forEach((character) => {
        if (!validRateAmount.test(character)) {
          i++;
        }
      });

    if (i > 0) {
      setErrorMessage("Iznos rate kredita nije ispravan.");
      showMess();
      i = 0;
      return;
    }
    i = 0;
    loan.debt
      .toString()
      .split("")
      .forEach((character) => {
        if (!validDebt.test(character)) {
          i++;
        }
      });

    if (i > 0) {
      setErrorMessage("Iznos duga nije ispravan.");
      showMess();
      i = 0;
      return;
    }

    if (loan.amount <= 0) {
      setErrorMessage("Iznos duga mora biti pozitivan.");
      showMess();
      i = 0;
      return;
    }
    if (loan.rateAmount <= 0) {
      setErrorMessage("Iznos rate duga mora biti pozitivan.");
      showMess();
      i = 0;
      return;
    }
    setLoanError(false);
  };

  const addLoan = (e) => {
    e.preventDefault();

    var loan = {
      serialNum: serialNum.toString(),
      amount: amount,
      dateOfApproval: dateOfApproval,
      startDate: dateFormat(startDate, "yyyy-mm-dd"),
      endDate: dateFormat(endDate, "yyyy-mm-dd"),
      rateAmount: rateAmount,
      rateNumber: rateNumber,
      debt: debt,
      operation: "INSERT",
    };
    setLoanError(true);
    validateLoanInfo(loan);
    if (loanError == true) {
      // setLoanError(true)
      return;
    }
    setLoans(loans.concat(loan));
    setSerialNum(serialNum + 1);
  };
  const deleteLoan = (e, serialNum) => {
    e.preventDefault();
    const newList = loans.filter((item) => item.serialNum !== serialNum);

    setLoans(newList);
  };
  const handleUpdateClick = (e, loan) => {
    e.preventDefault();
    setEditLoanNumber(loan.serialNum);
    var formData = {
      serialNum: loan.serialNum,
      amount: loan.amount,
      dateOfApproval: loan.dateOfApproval,
      startDate: loan.startDate,
      endDate: loan.endDate,
      rateAmount: loan.rateAmount,
      rateNumber: loan.rateNumber,
      debt: loan.debt,
      operation: loan.operation,
    };
    setEditLoanData(formData);
  };
  const handleCancelClick = (e) => {
    e.preventDefault();
    setEditLoanNumber(null);
  };
  const validateReportInfo = (report) => {
    console.log("********************************************************")
    console.log("Report info validation....")
    console.log("********************************************************")
    console.log(report.legalEntity)
    if (
      (report.reportNum.trim() == "") |
      (report.bankName.trim() == "") |
      (report.reportDate == "") |
      (reportDate == null)
    ) {
      setErrorMessage("Morate uneti sve podatke.");
      showMess();
      return true;
    }
    if(report.legalEntity==null && !id){
      setErrorMessage("Morate izabrati pravno lice na koje se izveštaj odnosi..");
      showMess();
      return true;

    }
    var i = 0;
    report.reportNum.split("").forEach((character) => {
      if (!validReportNumber.test(character)) {
        i++;
      }
    });

    if (i > 0) {
      setErrorMessage("Broj izveštaja nije ispravan.");
      showMess();
      i = 0;
      return true;
    }
    i = 0;
    report.bankName.split("").forEach((character) => {
      if (!validBankName.test(character)) {
        i++;
      }
    });

    if (i > 0) {
      setErrorMessage("Naziv banke nije ispravan.");
      showMess();
      i = 0;
      return true;
    }

    setReportInfoError(false);
    return false;
  };
  const handleReportSaving = (e) => {
    console.log(legalEntity)
    e.preventDefault();
    if(legalEntity==null){
      setErrorMessage(
        "Morate uneti pravno lice na koje se odnosi izveštaj."
      );
      showMess();

    }
    const report = {
      date: dateFormat(reportDate, "yyyy-mm-dd"),
      reportNum: reportNum.toString(),
      bankName: bankName,
      reportStatus: "FILLED",
      loans: loans,
      legalEntity: {
        id: legalEntity.id,
        identificationNumber: legalEntity.identificationNumber,
        accountNumber: legalEntity.accountNumber,
        street: legalEntity.street
      }
    };
    setReportInfoError(true);
    var error = validateReportInfo(report);
    if (error===true) {
      return;
    } else {
      CreditBureauReporsService.addBureauReport(report)
        .then((response) => {
          if(response.data.responseException==null){
             console.log("dodat izvestaj");
          getAllReports();
          nav("/izvestaji");
          }
          else{
            setErrorMessage(
              "Nije moguće sačuvati izveštaj. Proverite validnost unetih podataka kao i da li je izveštaj već evidentiran."
            );
            showMess();
          }
         
        })
        .catch((error) => {
            setErrorMessage(
              "Nije moguće sačuvati izveštaj. Proverite validnost unetih podataka kao i da li je izveštaj već evidentiran."
            );
            showMess();
            return;
          
        });
    }
  };
  const enableUpdate = (e) => {
    e.preventDefault();
    if (reportStatus != "VALIDATED") {
      setEditable(true);
    } else {
      setErrorMessage("Ne mozete izmeniti izvestaj koji je validiran.");
      showMess();
    }
  };
  const handleReportUpdating = (e) => {
    e.preventDefault();
    if (reportStatus == "FILLED") {
      setErrorMessage("Morate postaviti status izveštaja.");
      showMess();
      return;
    }
    setReportInfoError(true);
    const report = {
      id: id,
      date: dateFormat(reportDate, "yyyy-mm-dd"),
      reportNum: reportNum.toString(),
      bankName: bankName,
      reportStatus: reportStatus,
      loans: loans,
      legalEntity: legalEntity
    };

    var error = validateReportInfo(report);
    if (error == true) {
      console.log("Error report is true");
      return;
    }

    CreditBureauReporsService.updateReport(id, report)
      .then((response) => {
        if(response.data.responseException==null){
           setEditable(false);
        }
        else{
          setErrorMessage(   "Nije moguće izmeniti izveštaj. Proverite validnost unetih podataka.")
          showMess();
        }
       
      })
      .catch((error) => {
       console.log(error)
      });
  };
  const handleReportUpdateCanceling = (e) => {
    e.preventDefault();
    setEditable(false);
  };

  return (
    <>
      <div className="frm-add-div">
        <div className="container">
          <div className="row">
            <div className=" col-md-6 offset-md-3">
              {title()}
              {id ? (
                <></>
              ) : (
                <div className="text-center mb-5 text-dark">
                  Unesite potrebne podatke
                </div>
         
              )}
                      <h6>Napomena: Tekstualna polja popunjavati ošišanom latinicom.</h6>
            </div>
            {id ? (
              <button
                type="button"
                className="update-loan-btn"
                onClick={(e) => enableUpdate(e)}
              >
                Izmeni
              </button>
            ) : (
              <></>
            )}
            <div className="error-messages">
              {" "}
              {errorMessage && <p> {errorMessage} </p>}
            </div>
          </div>
          <div className="report-form">
            <div className="form-group">
              <label for="report-num">Šifra izveštaja</label>
              <input
                type="text"
                className="form-control"
                readOnly={!editable}
                name="reportnum"
                id="report-num"
                defaultValue={reportNum}
                onChange={(e) => setReportNum(e.target.value)}
                required={true}
              />
            </div>
            <div className="form-group">
              <label for="bank-name">Naziv banke</label>
              <input
                type="text"
                className="form-control"
                readOnly={!editable}
                name="bankname"
                id="bank-name"
                defaultValue={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label for="issue-date">Datum izdavanja</label>
              <input
                type="date"
                className="form-control"
                readOnly={!editable}
                name="reportdate"
                id="issue-date"
                defaultValue={
                  reportDate == null
                    ? null
                    : dateFormat(reportDate, "yyyy-mm-dd")
                }
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
           {!id ? <>
            <div className="form-group">
              <label for="issue-date">
                Pravno lice na koje se odnosi izveštaj
              </label>
              <br></br>
              <select className="legalEntititesSelect" onChange={(e)=>changeLegalEntity(e.target.value)}   >
              <option value={null} >...</option>
              {
                  legalEntities.map(entity =>
                    
                        <option key={entity.id} value={entity.id}>{entity.name}</option>
                    


                  )
              }
            </select>
            </div></> : <>
            </>} 
            <br></br>
            {editable ? (
              <form>
                <div className="grid-loan-data">
                  <div>
                    <div className="form-group">
                      <label for="rb">RB.</label>
                      <input
                        type="text"
                        value={serialNum}
                        className="form-control"
                        id="rb"
                        readOnly={true}
                      />
                    </div>
                    <div className="form-group">
                      <label for="approval-date">Datum odobrenja</label>
                      <input
                        type="date"
                        className="form-control"
                        id="approval-date"
                        readOnly={!editable}
                        onChange={(e) => setDateOfApproval(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label for="start-date">Datum početka isplate</label>
                      <input
                        type="date"
                        className="form-control"
                        id="start-date"
                        readOnly={!editable}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label for="end-date">Datum kraja isplate</label>
                      <input
                        type="date"
                        className="form-control"
                        id="end-date"
                        readOnly={!editable}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-group">
                      <label for="amount">Iznos (din)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="amount"
                        name="amount"
                        readOnly={!editable}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label for="rate-amount">Iznos rate (din)</label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly={!editable}
                        id="rate-amount"
                        name="rate-amount"
                        onChange={(e) => setRateAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label for="rate-num">Broj rata</label>
                      <input
                        type="number"
                        min={1}
                        className="form-control"
                        id="rate-num"
                        name="rate-num"
                        readOnly={!editable}
                        onChange={(e) => setRateNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label for="debt">Ostatak duga (din)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="debt"
                        name="debt"
                        readOnly={!editable}
                        onChange={(e) => setDebt(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="add-loan-btn"
                  onClick={(e) => addLoan(e)}
                >
                  Dodaj kredit
                </button>
              </form>
            ) : (
              <></>
            )}

            <table className="table table-bordered table-responsive-md">
              <thead>
                <tr>
                  <th scope="col">RB.</th>
                  <th scope="col">Iznos</th>
                  <th scope="col">Datum odobrenja</th>
                  <th scope="col">Datum početka isplate</th>
                  <th scope="col">Datum kraja isplate</th>
                  <th scope="col">Iznos rate</th>
                  <th scope="col">Broj rata</th>
                  <th scope="col">Ostatak duga</th>
                  <th scope="col">Operacije</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <>
                    {editLoanNumber === loan.serialNum ? (
                      <EditableRow
                        loan={loan}
                        editFormData={editLoanData}
                        validateLoanInfo={validateLoanInfo}
                        loanError={loanError}
                        setLoanError={setLoanError}
                        handleCancelClick={handleCancelClick}
                        handleSaveChangesClick={handleSaveChangesClick}
                      ></EditableRow>
                    ) : (
                      <ReadOnlyRow
                        loan={loan}
                        editable={editable}
                        deleteLoan={deleteLoan}
                        handleUpdateClick={handleUpdateClick}
                      ></ReadOnlyRow>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            {id ? (
              <div className="radio-buttons add-report-radios">
                <input
                  type="radio"
                  id="checked"
                  name="report-status"
                  value="CHECKED"
                  checked={reportStatus == "CHECKED"}
                  onChange={(e) => onChangeValue(e)}
                />
                <label for="all">Proveren</label>
                <input
                  type="radio"
                  id="filled"
                  name="report-status"
                  value="VALIDATED"
                  checked={reportStatus == "VALIDATED"}
                  onChange={(e) => onChangeValue(e)}
                />
                <label for="css">Validiran</label>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="optionButtons">
          {id ? (
            <>
              <button
                type="button"
                className="btn btn-sucess btn-save-report"
                onClick={(e) => handleReportUpdating(e)}
                disabled={!editable}
              >
                Sačuvaj izmene
              </button>
              {editable ? (
                <button
                  type="button"
                  className="btn btn-cancel btn-save-report"
                  onClick={(e) => handleReportUpdateCanceling(e)}
                >
                  Otkaži
                </button>
              ) : (
                <></>
              )}{" "}
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-sucess btn-save-report"
                onClick={(e) => handleReportSaving(e)}
              >
                Sačuvaj izveštaj
              </button>
            </>
          )}
          </div>
         
        </div>
      </div>
    </>
  );
}

export default AddReportComponent;
