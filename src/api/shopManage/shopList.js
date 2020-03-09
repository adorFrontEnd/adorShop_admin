import { md5 } from '../../utils/signMD5.js';
import baseHttpProvider from '../base/baseHttpProvider';

const shopList = (params) => {
  return baseHttpProvider.postFormApi('api/shop/searchList', params,{ total: true });
}

const saveOrUpdate = (params) => {
  if (params.password) {
    params.password = md5(params.password);
  }
  return baseHttpProvider.postFormApi('api/shop/saveOrUpdate', params);
}

const checkShopOper = (params) => {
  return baseHttpProvider.getApi('api/shop/checkShopOper', params);
}

const updateStatus = (params) => {
  return baseHttpProvider.getApi('api/shop/updateStatus', params);
}

const getDetail = (params) => {
  return baseHttpProvider.getApi('api/shop/getDetail', params);
}

const getList = (params) => {
  return baseHttpProvider.getApi('api/category/getList', params);
}
export {
    shopList,
    saveOrUpdate,
    checkShopOper,
    updateStatus,
    getDetail,
    getList
}