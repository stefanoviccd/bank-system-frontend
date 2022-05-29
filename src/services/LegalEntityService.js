import axios from "axios";
const LEGAL_ENTITY_BASE_API_URL = "http://localhost:8089/api/v1/legalEntities";


class LegalEntityService {

    getAllEntities() {
        const token=window.localStorage.getItem("token")
        return axios.get(LEGAL_ENTITY_BASE_API_URL,  {headers :{
            Authorization: token

        }});
    }
    addLegalEntity(entity) {
        const token=window.localStorage.getItem("token")
        return axios.post(LEGAL_ENTITY_BASE_API_URL+"/new", entity,  {headers :{
            Authorization: token

        }}
           )
    }

    getLegalEntityById(entityId){
        const token=window.localStorage.getItem("token")
        return axios.get(LEGAL_ENTITY_BASE_API_URL+"/"+entityId, {headers :{
            Authorization: token

        }} )
    }

    updateLegalEntity(entityId, entity){
     const token=window.localStorage.getItem("token")
        return axios.put(LEGAL_ENTITY_BASE_API_URL+"/"+entityId, entity,  {headers :{
            Authorization: token

        }});
    }
    deleteLegalEntity(entityId){
        const token=window.localStorage.getItem("token")
        return axios.delete(LEGAL_ENTITY_BASE_API_URL+"/"+entityId,  {headers :{
            Authorization: token

        }});
    }

    getLegalEntitiesByValue(searchValue){
        const token=window.localStorage.getItem("token")
        return axios.get(LEGAL_ENTITY_BASE_API_URL+"/search/"+searchValue,  {headers :{
            Authorization: token

        }});

    }
}
export default new LegalEntityService();