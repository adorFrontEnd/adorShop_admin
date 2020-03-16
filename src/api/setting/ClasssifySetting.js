import baseHttpProvider from '../base/baseHttpProvider';


const searchList = (params) => {
    return baseHttpProvider.postFormApi('api/prd/category/searchList', params, { total: true });
}

const saveOrUpdate = (params) => {
    return baseHttpProvider.postFormApi('api/prd/category/saveOrUpdate', params)
}
const levelList = (params) => {
    return baseHttpProvider.getApi('api/prd/category/levelList', params)
}
const saveSort = (params) => {
    return baseHttpProvider.getApi('api/prd/category/saveSort', params)
}

const deleteClassify = (params) => {
    return baseHttpProvider.getApi('api/prd/category/delete', params)
}
export {
    searchList,
    saveOrUpdate,
    levelList,
    saveSort,
    deleteClassify
}