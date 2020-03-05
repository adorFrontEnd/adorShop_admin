let domain = '';

//俊宝
// domain = "http://192.168.20.94:9300";
// domain = "http://192.168.20.95:7100";


// 博文
// domain = "http://47.103.71.160:9091";
domain = "http://192.168.20.52:9091";
// 测试
// domain='http://test.shop.admin.adorsmart.com';
let apiUrlPrefix = domain + "/";

let uploadDomain = "http://fi.adorsmart.com";
let uploadApiUrlPrefix = uploadDomain + "/";
let picUrlPrefix = "";
let signKey = "94a7cbbf8511a288d22d4cf8705d61d0";
let commonSign = '561wd03kkr86615s1de3x45s1d';
let qrcodeSign = '00461do1156916w1141c56r2ggw2';
let upLoadConfigData = {
  project: "adorShop"
}

export {
  apiUrlPrefix,
  picUrlPrefix,
  domain,
  signKey,
  commonSign,
  qrcodeSign,
  uploadApiUrlPrefix,
  upLoadConfigData
}