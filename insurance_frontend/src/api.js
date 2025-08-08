import axios from 'axios'
import config from './config'

const api = axios.create({ baseURL: config.apiBaseUrl })

export const getAllPolicies = () => api.get('/available-policies')
export const getUserPolicies = () => api.get('/policies')
export const getPolicyById = (id) => api.get(`/policies/${id}`) 

export const postPolicy = (data) => api.post('/policies', data) //data should be of this type => { farmer_id, crop_type, coverage_amount, premium, expiration_date, token_id }



export default api