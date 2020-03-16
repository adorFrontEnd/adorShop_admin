import { md5 } from '../../utils/signMD5.js';
import baseHttpProvider from '../base/baseHttpProvider';

const shopList = (params) => {
  return baseHttpProvider.postFormApi('api/shp/shop/searchList', params,{ total: true });
}

const saveOrUpdate = (params) => {
  return baseHttpProvider.postFormApi('api/shp/shop/saveOrUpdate', params);
}

const checkShopOper = (params) => {
  return baseHttpProvider.getApi('api/shp/shop/checkShopOper', params);
}

const updateStatus = (params) => {
  return baseHttpProvider.getApi('api/shp/shop/updateStatus', params);
}

const getDetail = (params) => {
  return baseHttpProvider.getApi('api/shp/shop/getDetail', params);
}

const getList = (params) => {
  return baseHttpProvider.getApi('api/prd/category/getList', params);
}
export {
    shopList,
    saveOrUpdate,
    checkShopOper,
    updateStatus,
    getDetail,
    getList
}