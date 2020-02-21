import baseHttpProvider from '../base/baseHttpProvider';
import { md5 } from '../../utils/signMD5.js';

const searchRoleList = (params) => {
  return baseHttpProvider.postFormApi('api/admin/role/searchList', { page: 1, size: 10, ...params },
    {
      total: true
    })
}

const deleteRole = (params) => {
  return baseHttpProvider.getApi('api/admin/role/delete', params)
}

const saveOrUpdate = (params) => {
  return baseHttpProvider.postFormApi('api/admin/role/saveOrUpdate', params)
}

const getAllList = (params) => {
  return baseHttpProvider.getApi('api/admin/source/getAll', params)
}


export {
  searchRoleList,
  deleteRole,
  getAllList,
  saveOrUpdate
}