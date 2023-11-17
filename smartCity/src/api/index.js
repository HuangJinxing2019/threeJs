import axios from "axios";

export const getDataList = () => {
    return axios.get('/api/getDataList');
}
export const getEventList = () => {
    return axios.get('/api/getEventList');
}