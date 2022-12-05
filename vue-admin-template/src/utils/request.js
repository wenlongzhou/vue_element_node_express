import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // console.log(res)

    if (res.code === 401) {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    } else if (res.code === 400) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
    } else if (res.message) {
      Message({
        message: res.message,
        type: 'success',
        duration: 3 * 1000
      })
    }

    return res
  },
  error => {
    const res = error.response
    console.log(error.response)

    Message({
      message: res.data.message,
      type: 'error',
      duration: 3 * 1000
    })

    return Promise.reject(error)
  }
)

export default service
