import baseHttpProvider from '../base/baseHttpProvider';

const getCityList = (params) => {

  return baseHttpProvider.getApi('api/city/getCityList',null
 )
}


const saveSort = (params) => {
  return baseHttpProvider.postApi('api/city/batchSaveOrUpdateBySort',
    {
      ...params
    },
    {
      total: true
    })
}

export {
  getCityList,
  saveSort
}