import baseHttpProvider from '../base/baseHttpProvider';
import { md5 } from '../../utils/signMD5.js'

const deleteOper = (params) => {
  return baseHttpProvider.getApi('api/sys/admin/oper/delete', params);
}

const searchOperList = (params) => {
  return baseHttpProvider.postFormApi('api/sys/admin/oper/searchList', { page: 1, size: 10, ...params }, { total: true });
}

const saveOrUpdate = (params) => {
  return baseHttpProvider.postFormApi('api/sys/admin/oper/saveOrUpdate', params, { total: true });
}


export {
  deleteOper,
  searchOperList,
  saveOrUpdate
}