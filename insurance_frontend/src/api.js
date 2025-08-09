import axios from 'axios'
import config from './config'

const api = axios.create({ baseURL: config.apiBaseUrl })

export const getAllPolicies = () => api.get('/available-policies')
export const getPolicyByUserId = (id) => api.get(`/policies/${encodeURIComponent(id)}`) 

export const postPolicy = (data) => api.post('/policies', data) //data should be of this type => { farmer_id, crop_type, coverage_amount, premium, expiration_date, token_id }
export const postClaimPolicy = (data) => api.post('/policies/claim', data) //data should be of this type { farmer_id, token_id }


export default api