import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register/`, {
    username: email,
    email: email,
    password: password,
    first_name: name
  })
  return response.data
}

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/token/`, {
    username: email,
    password: password
  })
  
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)
  }
  
  return response.data
}

export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getProfile = async () => {
  const token = localStorage.getItem('access_token')
  const response = await axios.get(`${API_URL}/auth/profile/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}
