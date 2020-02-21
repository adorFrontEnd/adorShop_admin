import React, { Component } from "react";
import { Col, Row, Form, Button, Input, Table, Popconfirm, Modal, Checkbox, Divider, Select } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchList, saveOrUpdate, levelList, saveSort, deleteClassify } from '../../api/setting/ClasssifySetting';
import { searchRoleList } from '../../api/oper/role';
import { pagination } from '../../utils/pagination';
import PictureWall from '../../components/upload/PictureWall';

const _title = "分类设置";
const _description = "";
const { Option } = Select;
class Page extends Component {

  state = {
    checked: false,
    tableDataList: null,
    imageUrl: null,
    classList: null,
    selectValue:null

  }

  componentWillMount() {
    this.getPageData();
    this.getlevelList()

  }

  params = {
    page: 1
  }
  handleChange = (value) => {
    this.setState({selectValue:value})
  }
 
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchList(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize
        _this.getPageData();
      })

      this.setState({
        tableDataList: res.data,
        pagination: _pagination
      })
    }).catch(() => {
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
  getlevelList = () => {
    levelList({ page: 1, size: 100 })
      .then(res => {
        if (res && res && res.length) {
          let classList = res;
          this.setState({
            classList
          })
   

        }
      })
  }

  // 表格相关列 
  columns = [
    { title: "分类名称", dataIndex: "name" },
    { title: "分类图片", dataIndex: "imageUrl", render: data => <span><img style={{ height: 40, width: 40 }} src={data} /></span> },
    { title: "移动", dataIndex: "roleName", render: data => data || '--' },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>

          <span>
            <a onClick={() => { this.showAcountModal(record) }}>编辑信息</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topLeft" title='确认要删除吗？'
              onConfirm={() => { this.deleteClassify(record) }} >
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
      field: "name",
      label: "分类名称:",
      placeholder: "请输入名称",
      rules: [
        { required: true, message: '请输入名称!' }
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
    let { parentId } = data;

    let { checked, imageUrl,selectValue } = this.state;
    selectValue=selectValue.split('-')
    let isSuperclass
    let level
    if (checked) {
      isSuperclass = 1;
      parentId = 0;
      level = 1
    } else {
      isSuperclass = 0;
      parentId = parseInt(selectValue[1]);
      if(selectValue[0]==1){
        level=2
      }else if(selectValue[0]==2){
        level=3
      }
    }
    let params = { ...data, parentId, level, isSuperclass, imageUrl }

    let title = '添加分类成功！';
    if (this.state.selectOper) {
      let { id } = this.state.selectOper;
      params.id = id;
      title = '修改分类成功！'
    }
    saveOrUpdate(params)
      .then(() => {
        Toast(title);
        this.getPageData();
        this._hideNewItemModal();
      })
  }

  deleteClassify = (record) => {
    let { id } = record;
    deleteClassify({ id })
      .then(() => {
        Toast("删除账号成功！");
        this.getPageData();
      })
  }

  uploadPic = (picList) => {
    let imageUrl = ''
    if (!picList || !picList.length) {
      this.setState({
        imageUrl
      })
      return;
    }
    imageUrl = picList[0];
    this.setState({
      imageUrl
    })
  }

  /**搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();

    let { inputKey, inputValue, ...data } = params;
    let _data = {};
    _data[inputKey] = inputValue || null;

    this.params = {
      ...data
    }
    this.params.page = 1;
    console.log(this.params)
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }




  onChange = (e) => {
    this.setState({ checked: e.target.checked })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };
    return (
      <CommonPage title={_title} description={_description} >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
          <div style={{ display: 'flex' }}>
            {/* <Button style={{ width: 100 }} type='primary'>全选/取消</Button> */}
            <Button onClick={() => { this.showAcountModal() }} style={{ width: 100, margin: '0 10px' }} type='primary'>添加分类</Button>
            <Button onClick={() => { this.showAcountModal() }} style={{ width: 100 }} type='primary'>保存排序</Button></div>
          <Form layout='inline'>
            <Form.Item
              field="name"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              {
                getFieldDecorator('name', {
                })(
                  <Input allowClear style={{ width: "240px" }} placeholder='填写分类名称' onChange={this.boxInputDataChange} />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.searchClicked}>筛选</Button>
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.resetClicked}>重置</Button>
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
          rowSelection={rowSelection}
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

            <Row className='line-height40'>
              <Col span={8} className='text-right'>
                父分类：
              </Col>
              <Col span={16}>
                <div>
                  <Select
                    placeholder="请选择父分类"
                    style={{ width: 242 }}
                    onChange={e => this.handleChange(e)}>
                    {this.state.classList && this.state.classList.map((item,index) => (
                      <Select.Option key={index} value={`${item.level}-${item.id}`} disabled={this.state.checked}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>


            <Row className='line-height40'>
              <Col span={8} className='text-right'>
              </Col>
              <Col span={16}>
                <div>
                  <Checkbox checked={this.state.checked} onChange={this.onChange} disabled={this.state.selectValue}/>
                  <span className='margin-left'>无父分类</span>
                </div>
              </Col>
            </Row>
            <Row className='margin-top10'>
              <Col span={8} className='text-right label-required'>
                分类图片：
              </Col>
              <Col span={16} >
                <PictureWall
                  folder='trace'
                  pictureList={this.state.imageUrl ? [this.state.imageUrl] : null}
                  uploadCallback={this.uploadPic}
                />
              </Col>

            </Row>
            <Row className='line-height40'>
              <Col span={8} className='text-right'>

              </Col>
              <Col span={16}>
                <div className='color-red'>
                  图片大小不超过2MB
                </div>
              </Col>
            </Row>
          </SubmitForm>

        </Modal>
      </CommonPage >)
  }
}

export default Form.create()(Page);