import axios from "axios";

const API_BASE = "http://localhost:3000/api/policies"; // Update if needed

export const fetchPolicies = async () => {
  const res = await axios.get(`${API_BASE}`);
  return res.data;
};

export const fetchPolicyById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};
