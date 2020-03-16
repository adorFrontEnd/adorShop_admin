import baseHttpProvider from '../base/baseHttpProvider';
import { md5 } from '../../utils/signMD5.js';

const searchRoleList = (params) => {
  return baseHttpProvider.postFormApi('api/sys/admin/role/searchList', { page: 1, size: 10, ...params },
    {
      total: true
    })
}

const deleteRole = (params) => {
  return baseHttpProvider.getApi('api/sys/admin/role/delete', params)
}

const saveOrUpdate = (params) => {
  return baseHttpProvider.postFormApi('api/sys/admin/role/saveOrUpdate', params)
}

const getAllList = (params) => {
  return baseHttpProvider.getApi('api/sys/admin/source/getAll', params)
}


export {
  searchRoleList,
  deleteRole,
  getAllList,
  saveOrUpdate
}