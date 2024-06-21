import axios from 'axios'

const AxiosClient = axios.create({
  baseURL: 'https://codeforces.com/api/',
})

const onRequest = async (request: any) => {
  return request
}

const onRequestError = (error: any) => {
  return Promise.reject(error)
}

const onResponse = (response: any) => {
  return response
}

const onResponseError = async (error: any) => {
  return Promise.reject(error)
}

AxiosClient.interceptors.request.use(onRequest, onRequestError)
AxiosClient.interceptors.response.use(onResponse, onResponseError)

export { AxiosClient }
