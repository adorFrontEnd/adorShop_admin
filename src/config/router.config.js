const baseRoute = "";
const routerSort = ["home", "appManage", "transaction", "settlement", "oper", "shop", "enterpriseAccount", "thirdPartPay"];

const routerConfigArr = [
  {
    route_name: "login",
    path: baseRoute + "/login",
  },
  {
    route_name: "changepwd",
    path: baseRoute + "/changepwd"
  },
  {
    route_name: "forgotPwd",
    path: baseRoute + "/forgotPwd"
  },
  {
    route_name: "accountSelect",
    path: baseRoute + "/accountSelect"
  },
  {
    route_name: "home",
    path: baseRoute + "/home",
    loginRequired: true,
    title: "概览",
    icon: "line-chart",
    moduleAuth: true
  },
  {
    route_name: "shop",
    title: "门店管理",
    icon: "unordered-list",
    moduleAuth: true
  },
  {
    route_name: "shop.shopAuth",
    path: baseRoute + "/shop/shopAuth",
    loginRequired: true,
    moduleAuth: true,
    title: "门店管理",
    icon: "unordered-list"
  },
  {
    route_name: "shop.shopAuth.shopList",
    path: baseRoute + "/shop/shopList",
    loginRequired: true,
    moduleAuth: true,
    title: "门店列表",
    icon: "unordered-list"
  },
  {
    route_name: "shop.shopAuth.shopCreated",
    path: baseRoute + "/shop/shopCreated",
    loginRequired: true,
    moduleAuth: false,
    title: "创建门店",
    icon: "solution"
  },
  {
    route_name: "shop.shopAuth.shopEdit",
    path: baseRoute + "/shop/shopEdit",
    loginRequired: true,
    moduleAuth: false,
    title: "编辑门店",
    icon: "solution"
  },
  {
    route_name: "oper",
    title: "操作员管理",
    icon: "safety-certificate",
    moduleAuth: true
  },
  {
    route_name: "oper.operManage",
    path: baseRoute + "/oper/operManage",
    loginRequired: true,
    moduleAuth: true,
    title: "账号管理",
    icon: "user"
  },
  {
    route_name: "oper.operManage.operManage",
    path: baseRoute + "/oper/operManage",
    loginRequired: true,
    moduleAuth: true,
    title: "账号管理",
    icon: "user"
  },
  {
    route_name: "oper.roleAuth",
    path: baseRoute + "/oper/roleAuth",
    loginRequired: true,
    moduleAuth: true,
    title: "角色管理",
    icon: "solution"
  },
  {
    route_name: "oper.roleAuth.roleAuth",
    path: baseRoute + "/oper/roleAuth",
    loginRequired: true,
    moduleAuth: true,
    title: "角色管理",
    icon: "solution"
  },
  {
    route_name: "globalSetting",
    title: "全局设置",
    icon: "setting",
    moduleAuth: true
  },
  {
    route_name: "globalSetting.authSetting",
    path: baseRoute + "/globalSetting/authSetting",
    loginRequired: true,
    moduleAuth: true,
    title: "权限设置",
    icon: "environment"
  },
  {
    route_name: "globalSetting.authSetting.authSetting",
    path: baseRoute + "/globalSetting/authSetting",
    loginRequired: true,
    moduleAuth: true,
    title: "权限设置",
    icon: "environment"
  },
  {
    route_name: "globalSetting.areaSetting",
    path: baseRoute + "/globalSetting/areaSetting",
    loginRequired: true,
    moduleAuth: true,
    title: "地区设置",
    icon: "environment"
  },
  
  {
    route_name: "globalSetting.areaSetting.areaDeploy",
    path: baseRoute + "/globalSetting/areaDeploy",
    loginRequired: true,
    moduleAuth: true,
    title: "地区配置",
    icon: "environment"
  },
  {
    route_name: "globalSetting.classsifySetting",
    path: baseRoute + "/globalSetting/classsifySetting",
    loginRequired: true,
    moduleAuth: true,
    title: "分类设置",
    icon: "solution"
  },
  {
    route_name: "globalSetting.classsifySetting.shopClassify",
    path: baseRoute + "/globalSetting/shopClassify",
    loginRequired: true,
    moduleAuth: true,
    title: "商品分类",
    icon: "solution"
  }
]

const getRouterConfig = (routerConfigArr) => {
  let config = {};
  routerConfigArr.forEach((item, i) => {
    if (item && item.route_name) {
      let k = item.route_name;
      config[k] = { ...item, sort: i };
    }
  })
  return config;
}
const routerConfig = getRouterConfig(routerConfigArr);

export {
  baseRoute,
  routerConfig
}



