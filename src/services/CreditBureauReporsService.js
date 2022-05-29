import axios from "axios";
const REPORT_BASE_API_URL = "http://localhost:8089/api/v1/bureauReports";
class CrediBureauService {

    addBureauReport(report) {
        const token=window.localStorage.getItem("token")
        return axios.post(REPORT_BASE_API_URL, report,{headers :{
            Authorization: token

        }}
        )
    }
    getAllReports() {
        const token=window.localStorage.getItem("token")
        return axios.get(REPORT_BASE_API_URL, {headers :{
            Authorization: token

        }})

    }
    deleteReport(id) {
        const token=window.localStorage.getItem("token")

        return axios.delete(REPORT_BASE_API_URL + "/" + id, {headers :{
            Authorization: token

        }})

    }
    getReportsByValue(value) {
        const token=window.localStorage.getItem("token")
        return axios.get(REPORT_BASE_API_URL + "/search/" + value, {headers :{
            Authorization: token

        }});

    }
    getReportById(id) {
        const token=window.localStorage.getItem("token")
        return axios.get(REPORT_BASE_API_URL + "/" + id, {headers :{
            Authorization: token

        }})
    }
    
    updateReport(reportId, report){
        const token=window.localStorage.getItem("token")
        return axios.put(REPORT_BASE_API_URL+"/"+reportId, report, {headers :{
            Authorization: token

        }});
    }
}
export default new CrediBureauService();