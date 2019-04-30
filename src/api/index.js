import api from './public'

export const homeBanner = (params) => {
  return api.fetchGet('/item/banner', params)
}

export const homeItem = (params) => {
  return api.fetchGet('/item/hot', params)
}

export const userInfo = (params) => {
  return api.fetchGet('/user/checkLogin', params)
}

export const login = (params) => {
  return api.fetchGet('/user/login', params)
}

export const geetest = (params) => {
  return api.fetchGet('/user/geetestInit?t=' + (new Date()).getTime(), params)
}

export const itemInfo = (id, params) => {
  return api.fetchGet('/item/detail/' + id, params)
}

export const getAllItem = (type, params) => {
  return api.fetchGet('/item/all/' + type, params)
}

export const navList = (params) => {
  return api.fetchGet('/item/nav', params)
}

export const addCart = (params) => {
  return api.fetchPost('/cart/add', params)
}

export const getCartList = (userId, params) => {
  return api.fetchGet('/cart/' + userId, params)
}

export const addressList = (userId, params) => {
  return api.fetchGet('/cart/address/' + userId, params)
}

export const updateHot = (id, params) => {
  return api.fetchPut('/item/updateHot/' + id)
}

export const register = (params) => {
  return api.fetchPost('/user/register', params)
}

export const updatePwd = (id, params) => {
  return api.fetchPut('/user/updatePassword/' + id, params)
}

export const getItemByPrice = (limit, params) => {
  return api.fetchGet('/item/all/price/' + limit, params)
}

export const getAllAddress = (id) => {
  return api.fetchGet('/address/' + id)
}

export const deleteAddress = (id) => {
  return api.fetchDel('/address/delete/' + id)
}

export const updateAddress = (params) => {
  return api.fetchPut('/address/update', params)
}

export const updateDefaultAddress = (id) => {
  return api.fetchPut('/address/update/' + id)
}

export const addAddress = (params) => {
  return api.fetchPost('/address/add', params)
}

export const delToken = (params) => {
  return api.fetchDel('/user/logout', params)
}

export const pushCartList = (params) => {
  return api.fetchPost('/cart/push', params)
}

export const updateCart = (params) => {
  return api.fetchPut('/cart/update', params)
}

export const deleteCart = (params) => {
  return api.fetchDel('/cart/delete', params)
}
