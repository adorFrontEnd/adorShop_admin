import React, { Component } from "react";
import { Col, Row, Card, Spin, Form, Button, Input, Table, Popconfirm, Divider, Modal, Select } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchOperList, deleteOper, saveOrUpdate } from '../../api/oper/oper';
import { searchRoleList } from '../../api/oper/role';
import { pagination } from '../../utils/pagination';
import PictureWall from '../../components/upload/PictureWall';

const _title = "分类设置";
const _description = "";

class Page extends Component {

  state = {


  }

  componentWillMount() {


  }

  params = {
    page: 1
  }


  // 表格相关列 
  columns = [
    { title: "分类名称", dataIndex: "nickname" },
    { title: "分类图片", dataIndex: "username" },
    { title: "移动", dataIndex: "roleName", render: data => data || '--' },
    { title: "创建时间", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>

          <span>
            <a onClick={() => { this.showAcountModal(record) }}>编辑信息</a>
            <Popconfirm
              placement="topLeft" title='确认要删除吗？'
              onConfirm={() => { this.deleteOper(record) }} >
              <a size="small" className='color-red'>删除</a>
            </Popconfirm>
          </span>

        </span>
      )
    }
  ]

  /* Modal操作*******************************************************************************************************************************************/
  newItemFormList = [
    {
      type: "INPUT",
      field: "nickname",
      label: "分类名称:",
      placeholder: "请输入名称",
      rules: [
        { required: true, message: '请输入名称!' }
      ]
    },
    {
      type: "INPUT",
      field: "username",
      label: "父分类:",
      placeholder: "请输入手机号码",
      rules: [
        { required: true, message: '请输入手机号码!' }
      ]
    }
  
  ]

  // 打开modal
  showAcountModal = (data) => {
    this.setState({
      newItemModalVisible: true
    })
    let selectOper = data || null;
    let editFormValue = {};
    if (data) {
      let { roleId, roleName, username, nickname } = data;
      roleId = { key: roleId, label: roleName };
      editFormValue = { roleId, username, nickname, _s: Date.now() };
    }

    this.setState({
      editFormValue,
      selectOper
    })
  }

  // 关闭modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }

  newItemModalSaveClicked = (data) => {

    let { roleId } = data;
    roleId = roleId.key;

    let params = { ...data, roleId }
    let title = '添加账户成功！';
    if (this.state.selectOper) {
      let { id } = this.state.selectOper;
      params.id = id;
      title = '修改账户成功！'
    }
    saveOrUpdate(params)
      .then(() => {
        Toast(title);
        this.getPageData();
        this._hideNewItemModal();
      })
  }

  deleteOper = (record) => {
    let { id } = record;
    deleteOper({ id })
      .then(() => {
        Toast("删除账号成功！");
        this.getPageData();
      })
  }

  

 




  


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage title={_title} description={_description} >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <Button style={{ width: 100 }} type='primary'>全选/取消</Button>
            <Button onClick={() => { this.showAcountModal() }} style={{ width: 100, margin: '0 10px' }} type='primary'>添加分类</Button>
            <Button onClick={() => { this.showAcountModal() }} style={{ width: 100 }} type='primary'>保存排序</Button></div>
          <Form layout='inline'>
            <Form.Item>
              <Input placeholder='填写分类名称' onChange={this.boxInputDataChange} />
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.getPageData}>筛选</Button>
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.getPageData}>重置</Button>
            </Form.Item>
          </Form>
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
          title="创建/编辑分类"
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
              <Row className='margin-top10'>
              <Col span={8} className='text-right label-required'>
                分类图片：
              </Col>
              <Col span={16} >
                <PictureWall
                  folder='trace'
                  pictureList={this.state.logoPicUrl ? [this.state.logoPicUrl] : null}
                  uploadCallback={this.uploadPic}
                />
              </Col>
              <div>图片大小不超过2MB

</div>
            </Row>
          </SubmitForm>
        
        </Modal>
      </CommonPage >)
  }
}

export default Form.create()(Page);