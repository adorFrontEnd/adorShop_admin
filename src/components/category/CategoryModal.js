import React, { Component } from "react";
import { Input, Select, Form, Button, Checkbox, Radio, Modal, Row, Col, Tree, Icon } from 'antd'
import { getIdMap, getSelectArrTotalName, getCheckedNamesByIds } from './categoryUtils';
import { searchList } from '../../api/setting/ClasssifySetting';
import { parseTree } from '../../utils/tree';
const { TreeNode } = Tree;

class cModal extends Component {

  state = {
    categoryList: [],
    showClassifyLoading: false,
    rawClassifyList: null,
    idMap: {},
    checkedKeys: []
  }

  componentDidMount() {
    this.getClassify();
  }

  componentWillReceiveProps(props) {
    if (this.compareIds(this.props.categoryIds, props.categoryIds)){
      this.reverData(props.categoryIds);
    }
  }

  compareIds = (ids, newIds) => {
    if (!ids || !newIds || ids.length != newIds.length) {
      return true
    }
    return
  }

  reverData = (categoryIds) => {
    this.setState({
      checkedKeys:categoryIds
    })
  }

  // 获取所有分类
  getClassify = () => {
    this.setState({
      showClassifyLoading: true
    })
    searchList()
      .then(rawClassifyList => {
        let classifyList = parseTree(rawClassifyList.data, true);
        let idMap = getIdMap(rawClassifyList.data)
        this.setState({
          showClassifyLoading: false,
          classifyList,
          rawClassifyList: rawClassifyList.data,
          idMap
        })
      })
      .catch(() => {
        this.setState({
          showClassifyLoading: false
        })
      })
  }

  onCancel = () => {
    this.props.onCancel()
  }

  onOk = () => {
    let { checkedKeys, idMap } = this.state;
    let category = getCheckedNamesByIds(idMap, checkedKeys, " ");
    let params = {
      categoryIds: checkedKeys,
      category
    };
    this.props.onOk(params)
  }

  //搜索
  onsearchClick = () => {

  }

  //更改选择树
  onCheck = (checkedKeys, info) => {
    let { categoryIds, rawClassifyList, idMap } = this.state;

    checkedKeys = checkedKeys.filter(item => item != '0-0');
    let categoryList = getSelectArrTotalName(checkedKeys, idMap);
    this.setState({
      checkedKeys,
      categoryList
    })
  };

  delateClass = (item) => {
    let { categoryList, checkedKeys } = this.state;
    for (var i = 0; i < categoryList.length; i++) {
      if (categoryList[i] == item) {
        categoryList.splice(i, 1);
        break;
      }
    }
    checkedKeys.map(id => {
      if (id == item.id) {
        checkedKeys.splice(i, 1);
      }
    })
    this.setState({ categoryList, checkedKeys });
  }

  render() {

    const { shopOper, category, categoryList } = this.state
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible={this.props.visible}
        title={this.props.title || "商品分类"}
        onOk={this.onOk}
        onCancel={this.onCancel}
        width='800px'
      >
        <div style={{ display: 'flex', position: 'relative' }}>
          <div style={{ width: '50%', padding: '24px', borderRight: '1px solid #f2f2f2' }}>
            <Form>

              <Form.Item>
                <div style={{ display: 'flex' }}>
                  {
                    getFieldDecorator('inputValue', {
                    })(
                      <Input allowClear style={{ width: "240px" }} onChange={this.boxInputDataChange} />
                    )
                  }
                  <Button type='primary' onClick={this.onsearchClick} style={{ margin: '0 10px' }}>搜索</Button>
                  <Button type='primary' onClick={this.resetClicked}>重置</Button>
                </div>
              </Form.Item>
            </Form>
            <Tree
              showIcon
              checkedKeys={this.state.checkedKeys || []}
              defaultExpandAll={false}
              checkable
              onCheck={this.onCheck}
            >
              <TreeNode
                title='所有分类'
              >
                {this.renderTree()}
              </TreeNode>
            </Tree>
          </div>
          <div style={{ padding: '10px', width: '50%' }}>
            <div >
              {
                categoryList && categoryList.map((item, index) =>
                  (
                    <span key={index} className='classitem'>
                      <span>{item.totalName}</span>
                      <img src='/image/close.png' alt='' style={{ position: 'absolute', right: '10px' }} onClick={() => this.delateClass(item)} />
                    </span>
                  )
                )
              }
            </div>
            <div style={{ color: 'red' }}>一个商品最多选择5个分类，如选择了父类则其子类不可选择</div>
          </div>
        </div>
      </Modal>
    )
  }

  /**渲染**********************************************************************************************************************************/
  renderTree = () => {
    let classifyList = this.state.classifyList;
    return this.renderTreeNode(classifyList);
  }

  getTreeNodeTitle = (item) => {
    let hasChildren = !!item.children;
    let canDelete = !item.children || !item.children.length;
    return (
      <div className='flex-center'>
        <span className='margin-right'>{item.name}</span>
      </div>
    )
  }

  renderTreeNode = (data) => {
    return data && data.map((item) => {
      if (item.children) {
        return (
          <TreeNode selectable={false} title={this.getTreeNodeTitle(item)} key={item.id}>

            {this.renderTreeNode(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode selectable={false} title={this.getTreeNodeTitle(item)} key={item.id} />
      )
    })
  }
}


export default Form.create()(cModal);