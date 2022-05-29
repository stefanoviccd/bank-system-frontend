import axios from "axios";
const LEGAL_ENTITY_BASE_API_URL = "http://localhost:8089/api/v1/user/login";
class UserService {

    login(user) {
        return axios.post(LEGAL_ENTITY_BASE_API_URL, user)
        
    }
}
export default new UserService();
