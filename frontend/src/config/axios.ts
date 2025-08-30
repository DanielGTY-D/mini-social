import axios from 'axios';

const token = localStorage.getItem("AUTH_TOKEN")

export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Authorization: `Bearer ${token}`
    }
})