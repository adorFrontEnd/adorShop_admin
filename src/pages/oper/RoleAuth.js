import React, { Component } from "react";
import { Col, Row, Card, Spin, Form, Button, Input, Table, Divider, Modal, Popconfirm } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import dateUtil from '../../utils/dateUtil';
import { searchRoleList, deleteRole, saveOrUpdate } from '../../api/oper/role';
import { pagination } from '../../utils/pagination';
import { SearchForm, SubmitForm } from '../../components/common-form';
import AuthSelection from './AuthSelection';
const _title = "员工角色";
const _description = "";

class Page extends Component {

  state = {
    tableDataList: null,
    pagination: {},
    showTableLoading: false,
    newItemModalVisible: false,
    selectRoleAuth: [],
    selectRoleSpecAuth: [],
    editFormValue: null,
    selectRoleData: null
  }

  componentDidMount() {
    this.getPageData();
  }

  params = {
    page: 1
  }

  getPageData = () => {

    let _this = this;
    this._showTableLoading();
    searchRoleList(this.params)
      .then(res => {
        this._hideTableLoading();
        let _pagination = pagination(res, (current) => {
          _this.params.page = current
          _this.getPageData();
        }, (cur, pageSize) => {
          _this.params.page = 1;
          _this.params.size = pageSize
          _this.getPageData();
        })

        this.setState({
          tableDataList: res.data,
          pagination: _pagination
        })
      })
      .catch(() => {
        this._hideTableLoading();
      })
  }

  _showTableLoading = () => {
    this.setState({
      showTableLoading: true
    })
  }

  _hideTableLoading = () => {
    this.setState({
      showTableLoading: false
    })
  }

  // 表格相关列
  columns = [
    { title: "角色名", dataIndex: "name" },
    { title: "员工账号数", dataIndex: "accountNum", render: data => data || 0 },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.name != '超级管理员' ?
              <span>
                <a onClick={() => { this.showAuthModalClick(record) }}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  placement="topLeft" title='确认要删除吗？'
                  onConfirm={() => { this.deleteRole(record) }} >
                  <a size="small" style={{color:'#ff8716'}}>删除</a>
                </Popconfirm>
              </span>
              :
              '--'
          }
        </span>
      )
    }
  ]

  showAuthModalClick = (data) => {
    this.showAuthModal(data);
  }

  // 删除角色
  deleteRole = (data) => {
    let { id } = data;
    deleteRole({ id })
      .then(() => {
        Toast('删除成功！');
        this.getPageData();
      })
  }

 

  /* Modal操作*******************************************************************************************************************************************/
  newItemFormList = [
    {
      type: "INPUT",
      field: "name",
      label: "角色名称:",
      placeholder: "请输入角色名称",
      rules: [
        { required: true, message: '请输入角色名称!' }
      ]
    }
  ]


  // 打开modal
  showAuthModal = (data) => {
    let selectRoleAuth = [];
    let selectRoleSpecAuth = [];
    let editFormValue = null;
    let selectRoleData = null;
    if (data) {
      let { models, name, remark, specialModels } = data;
    
      editFormValue = { name, remark, _s: Date.now() }
      selectRoleAuth = this.getRoleAuthArr(models);
      selectRoleSpecAuth = this.getRoleAuthArr(specialModels);
      selectRoleData = data;
    }
    this.setState({
      newItemModalVisible: true,
      selectRoleAuth,
      selectRoleSpecAuth,
      editFormValue,
      selectRoleData
    })
  }

  // 隐藏modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false,
      selectRoleAuth: [],
      selectRoleSpecAuth: []
    })
  }

  newItemModalSaveClicked = (data) => {

    let { selectRoleAuth, selectRoleSpecAuth, selectRoleData } = this.state;

    let models = this.getRoleModels(selectRoleAuth);
    let specialModels = this.getRoleModels(selectRoleSpecAuth);
    if(!models){
      Toast('请选择权限！')
      return;
    }
    let params = { ...data, models, specialModels };
    let title = "添加角色成功！";
    if (selectRoleData) {
      params.id = selectRoleData.id;
      title = "修改角色成功！";
    }
    saveOrUpdate(params)
      .then(() => {
        Toast(title);
        this.getPageData();
        this._hideNewItemModal();
      })
  }

  getRoleModels = (selectRoleAuth) => {
    if (selectRoleAuth && selectRoleAuth.length) {
      let result = selectRoleAuth.join();
      return result
    }
  }

  getRoleAuthArr = (models) => {
    if (models) {
      let result = models.split(',');
      return result
    }
    return []
  }

  onCheckedChange = (selectRoleAuth) => {
    selectRoleAuth = selectRoleAuth&&selectRoleAuth.filter(item => item.indexOf('.') !== -1 || item == 'home')
    this.setState({
      selectRoleAuth
    })
  }

  onSpecCheckedChange = (selectRoleSpecAuth) => {
    selectRoleSpecAuth = selectRoleSpecAuth&&selectRoleSpecAuth.filter(item => item != 'all')
    this.setState({
      selectRoleSpecAuth
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage title={_title} description={_description} >
        <div style={{padding:'10px'}}>
        <div className='padding20-0'>
          <Button onClick={() => { this.showAuthModalClick() }} type='primary'>创建角色</Button>
        </div>
        <Table
          indentSize={10}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.tableDataList}
        />
        <Modal maskClosable={false}
          title="添加权限"
          visible={this.state.newItemModalVisible}
          footer={null}
          onCancel={this._hideNewItemModal}
          className='noPadding'
        >
          <SubmitForm
            clearWhenHide={true}
            showForm={this.state.newItemModalVisible}
            setFormValue={this.state.editFormValue}
            formItemList={this.newItemFormList}
            saveClicked={this.newItemModalSaveClicked}
            cancelClicked={this._hideNewItemModal}
          >
            <Row className='line-height40 margin-top'>
              <Col span={8} className='text-right'>
                <span className='label-color label-required'>权限：</span>
              </Col>
              <Col span={16}>
                <AuthSelection
                  selectRoleAuth={this.state.selectRoleAuth}
                  selectRoleSpecAuth={this.state.selectRoleSpecAuth}
                  onCheckedChange={this.onCheckedChange}
                  onSpecCheckedChange={this.onSpecCheckedChange}
                />
              </Col>
            </Row>
          </SubmitForm>
        </Modal>
        </div>
      </CommonPage>
    )
  }
}

export default Form.create()(Page);