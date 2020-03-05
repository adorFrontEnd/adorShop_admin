import React, { Component } from "react";
import { Form, Button, Input, Popconfirm, Icon, InputNumber, Tree } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { getAllList } from '../../api/oper/role';
import { getRouter } from '../../router/routerParse';
import { pagination } from '../../utils/pagination';
import { parseTree, getTreeLeMapLevelList } from '../../utils/tree';
import PictureWall from '../../components/upload/PictureWall';
import AuthSelection from '../oper/RoleAuth';
import './index.less';
const _title = "权限设置";
const _description = "";
const TreeNode = Tree.TreeNode;
class Page extends Component {

  state = {
    roleList: [],
    allSpecAuthList: [],
    authTree: [],
    authLoading: false,
    canRenderTree: false
  }

  componentDidMount() {
    this._getAllAuthList();
  }

  params = {
    page: 1
  }

  _getAllAuthList = () => {
    this.setState({
      authLoading: true
    })

    getAllList()
      .then(allAuth => {
        let normalAuthSortMap = this.getSourceSortNumMap(allAuth);
        let allAuthList = allAuth.map(item => item.source);
        let authTree = getRouter(allAuthList, true);
        this.setState({
          authTree,
          roleList: allAuth,
          canRenderTree: true,
          authLoading: false,
          normalAuthSortMap
        })
      })
      .catch(() => {
        this.setState({
          canRenderTree: true,
          authLoading: false
        })
      })
  }
  getSourceSortNumMap = (arr) => {
    if (!arr || !arr.length) {
      return {}
    }
    let sortMap = {};
    arr.forEach(item => {
      sortMap[item.source] = item.id;
    })
    return sortMap;
  }

  renderTreeNode = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode selectable={false} title={this.getTreeNodeTitle(item)} key={item.key}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode selectable={false} title={this.getTreeNodeTitle(item)} key={item.key} />
      )
    })
  }
  getTreeNodeTitle = (item) => {
    let hasChildren = !!item.children;
    let canDelete = !item.children || !item.children.length;
    return (
      <div className='flex-center'>
        <InputNumber size="small" onChange={(value) => { this.onClassifySortChange(value, item.key) }} style={{ width: 100, marginRight: 10 }} min={0} max={9999999} value={item.sort} />
        <span className='margin-right'>{item.title}</span>
        <Input value={item.key} className='margin-right' />
      </div>
    )
  }
  //保存分类排序
  saveClassifyOrder = () => {
    let order = this.formatSortSaveData(this.state.changedClassifySort);
    if (!order) {
      Toast('排序暂未修改！');
      return;
    }

    // saveSort({ vos: order })
    //   .then(() => {
    //     Toast('保存成功');
    //     this.getClassify();
    //   })

  }

  //格式化保存分类的数据
  formatSortSaveData = (changedClassifySort) => {
    if (!changedClassifySort || !Object.keys(changedClassifySort).length) {
      return;
    }

    let result = Object.keys(changedClassifySort).map(k => {
      return {
        id: k,
        sort: changedClassifySort[k]
      }
    });
    return result;
  }

  // 分类的排序input更改
  onClassifySortChange = (value, id) => {
    let roleList = this.state.roleList;
    if (!roleList) {
      return;
    }
    let index = this.findClassifyIndexById(id, roleList);
    if (index || index == 0) {
      roleList[index]['sort'] = value;
      // this.refreshClassifyList(roleList);
      let changedClassifySort = this.state.changedClassifySort;
      changedClassifySort[id] = value;
      this.setState({
        changedClassifySort
      })

    }
  }

  // 查找分类在数组的索引
  findClassifyIndexById = (id, arr) => {
    if (!id || !arr || !arr.length) {
      return;
    }
    let index = arr.findIndex((item) => {
      return item.id && item.id == id;
    });
    return index >= 0 ? index : null;
  }




  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} description={_description} >
        <div className='padding20-0'>
          <Popconfirm
            placement="topLeft" title={'确认要保存产品的排序设置吗？'}
            onConfirm={() => { this.saveClassifyOrder() }} >
            <Button type='primary' className='normal margin-right20'>保存排序</Button>
          </Popconfirm>
        </div>
        <Tree
          showIcon
          defaultExpandAll={false}
        >
          <TreeNode icon={<Icon type="deployment-unit" />} title="所有权限" key="all">
            {
              this.renderTreeNode(this.state.authTree)
            }
          </TreeNode>
        </Tree>
      </CommonPage >
    )
  }
}

export default Form.create()(Page);