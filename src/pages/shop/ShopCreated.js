import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Input, Select, Form, Button, Checkbox, Radio, DatePicker, Modal, Row, Col, Tree, InputNumber } from 'antd'
import Toast from '../../utils/toast';
import PictureWall from '../../components/upload/PictureWall';
import { NavLink, Link } from 'react-router-dom';
import dateUtil from '../../utils/dateUtil';
import { baseRoute, routerConfig } from '../../config/router.config';
import { saveOrUpdate, checkShopOper } from '../../api/shopManage/shopList';
import { parseTree } from '../../utils/tree';
import { searchList } from '../../api/setting/ClasssifySetting';
import CategorySelection from './categorySelection';
import './index.less';


const _title = '创建门店';
const { TreeNode } = Tree;
const _description = "";
const shopListPath = routerConfig["shop.shopAuth.shopList"].path;
class Page extends Component {

  state = {
    isShowModal: false,
    status: null,
    categoryList: null,
    selectRoleAuth: [],
    selectRoleSpecAuth: [],
    date: null,
    imageUrl: null,
    classifyList: null

  }
  componentWillMount() {
    this.getClassify();

  }

  params = {

  }
  shopCereated = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { date, imageUrl } = this.state;
      let deadlineStamp = dateUtil.getDayStartStamp(Date.parse(date));
      let shopOperId = 1
      let params = { ...data, imageUrl, deadlineStamp, shopOperId }

      // saveOrUpdate(params)
      //   .then(() => {
      //     Toast('创建门店成功');

      //   })




    })
  }
  // 选择经营分类
  clickChoose = () => {
    this.setState({ isShowModal: true })

  }
  handleCancel = () => {
    this.setState({ isShowModal: false });
  }
  handleOk = () => {
    this.setState({ isShowModal: false });
  }
  // 检测手机号
  clickPhoneTest = () => {
    let params = this.props.form.getFieldsValue();
    this.params.phone = params.phone;
    checkShopOper(this.params)
      .then(data => {
        if (!data) {
          this.setState({ status: 0 })
        }
      })

  }
  // 重置
  clickReset = () => {
    this.setState({ status: null })
  }

  // 获取所有分类
  getClassify = () => {
    this.setState({
      showClassifyLoading: true
    })
    searchList()
      .then(rawClassifyList => {
        let classifyList = parseTree(rawClassifyList, true);
        this.setState({
          showClassifyLoading: false,
          classifyList
        })
      })
      .catch(() => {
        this.setState({
          showClassifyLoading: false
        })
      })
  }

  onCheckedChange = (selectRoleAuth) => {
    selectRoleAuth = selectRoleAuth.filter(item => item.indexOf('.') !== -1 || item == 'home')
    this.setState({
      selectRoleAuth
    })
  }
  onDateChange = (date, dateString) => {
    this.setState({ date: dateString })

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
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage title={_title} description={_description} style={{ padding: '0' }}>
        <div style={{ display: 'flex', height: '30px', lineHeight: '30px' }}>
          <div style={{ width: '10px', background: '#FAAD14' }}></div>
          <div style={{ width: '100%', background: '#F2F2F2', paddingLeft: '10px', fontWeight: 'bold' }}>基础信息</div>
        </div>
        <div style={{ width: 600, padding: 20 }}>
          <Form className='common-form'>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label='门店名称：'
              key='shopName'
              field='shopName'
            >
              {
                getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '输入门店名称' }
                  ]
                })(
                  <Input allowClear />
                )
              }
            </Form.Item>

            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label='门店地址：'
              key='address'
              field='address'
            >
              {
                getFieldDecorator('address', {
                  rules: [
                    { required: true, message: '输入门店地址' }

                  ]
                })(
                  <Input allowClear />
                )
              }
            </Form.Item>

            <Row className='margin-top10'>
              <Col span={6} className='text-right label-required'>
                店招：
              </Col>
              <Col span={16} >
                <PictureWall
                  folder='trace'
                  pictureList={this.state.imageUrl ? [this.state.imageUrl] : null}
                  uploadCallback={this.uploadPic}
                />
              </Col>
            </Row>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label='授权截止'
              key='deadlineStamp'
              field='deadlineStamp'
            >
              <div style={{ display: 'flex' }}>
                {
                  getFieldDecorator('deadlineStamp', {
                    rules: [
                      { required: true, message: '请选择时间' }

                    ]
                  })(
                    <DatePicker onChange={this.onDateChange} style={{ width: 170 }} showTime={true} placeholder={"请选择时间"} format="YYYY-MM-DD HH:mm:ss" />
                  )
                }
                <div style={{ color: 'red', marginLeft: '10px' }}>到达授权截止日期门店自动封禁</div>
              </div>

            </Form.Item>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label='经营范围：'
              key=' businessScope '
              field='businessScope'
            >
              <div style={{ display: 'flex' }}>
                <Button onClick={() => { this.clickChoose() }} style={{ width: 150, marginRight: '20px' }} type='primary'>选择经营分类</Button>
                <div>棉布</div>
              </div>

            </Form.Item>
          </Form>



        </div>
        <div style={{ display: 'flex', height: '30px', lineHeight: '30px' }}>
          <div style={{ width: '10px', background: '#FAAD14' }}></div>
          <div style={{ width: '100%', background: '#F2F2F2', paddingLeft: '10px', fontWeight: 'bold' }}>超管信息</div>
        </div>
        <div style={{ width: 600, padding: 20 }}>
          <Form>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label='手机号：'
              key='phone'
              field='phone'
            >
              <div style={{ display: 'flex' }}>
                {
                  getFieldDecorator('phone', {
                    rules: [
                      { required: true, message: '输入门店地址' }

                    ]
                  })(
                    <Input allowClear />
                  )
                }
                <Button type='primary' onClick={this.clickPhoneTest} style={{ margin: '0 10px' }}>检测</Button>
                <Button type='primary' onClick={this.clickReset}>重置</Button>
              </div>

            </Form.Item>
            {
              this.state.status == 0 ?
                <div>
                  <div style={{ color: 'red', marginLeft: '13%' }}>该手机号尚未注册，请填写注册信息，点击保存按钮完成注册</div>

                </div> : null

            }
            {
              this.state.status == 1 ?
                <div style={{ marginLeft: '13%' }}>
                  <div>存在账号，保存即确认使用此账号作为该门店的超级管理员</div>
                  <div style={{ display: 'flex', padding: '10px', border: '1px solid #ccc', marginTop: '10px' }}>
                    <div style={{ width: '50px', height: '50px', background: "#ccc", marginRight: '10px' }}></div>
                    <div >
                      <div>兰鹏飞</div>
                      <div style={{ marginTop: '10px', color: '#ff6700' }}> 13880149364</div>
                    </div>
                  </div>
                </div> : null
            }

          </Form>
        </div>


        <Modal
          visible={this.state.isShowModal}
          title="商品分类"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>
          ]}
          width='800px'
        >
          <div style={{ display: 'flex', position: 'relative' }}>
            <div style={{ width: '50%', padding: '24px', borderRight: '1px solid #f2f2f2' }}>
              <div style={{ display: 'flex' }}>
                <Input allowClear />
                <Button type='primary' onClick={this.clickPhoneTest} style={{ margin: '0 10px' }}>搜索</Button>
                <Button type='primary' onClick={this.clickReset}>重置</Button>
              </div>
              <CategorySelection
                selectRoleAuth={this.state.selectRoleAuth}
                selectRoleSpecAuth={this.state.selectRoleSpecAuth}
                onCheckedChange={this.onCheckedChange}
                onSpecCheckedChange={this.onSpecCheckedChange}
              />
            </div>


            <div style={{ padding: '10px' }}>
              <div style={{ color: 'red', position: 'absolute', bottom: '10px' }}>一个商品最多选择5个分类，如选择了父类则其子类不可选择</div>
            </div>
          </div>

        </Modal>
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button className='save-btn' type='primary' onClick={this.shopCereated} disabled={this.state.status == 0}>保存</Button>
          <NavLink to={shopListPath}>
            <Button className='save-btn' type='primary'>返回</Button>
          </NavLink>
        </div>
      </CommonPage >
    )
  }
  renderTree = () => {
    let classifyList = this.state.classifyList;
    return this.renderTreeNode(classifyList);
  }

  getTreeNodeTitle = (item) => {
    let hasChildren = !!item.children;
    let canDelete = !item.children || !item.children.length;
    return (
      <div className='flex-center'>

        <InputNumber size="small" onChange={(value) => { this.onClassifySortChange(value, item.id) }} style={{ width: 80, marginRight: 10 }} min={0} max={9999999} value={item.sort} />
        <span className='margin-right'>{item.name}</span>
      </div>
    )
  }

  renderTreeNode = (data) => {
    return data.map((item) => {
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

export default Form.create()(Page);