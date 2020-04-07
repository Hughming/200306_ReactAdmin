import React, { Component } from 'react';
import {
    Card,
    Table,
    Button,
    message,
    Modal
} from 'antd'
import {
    PlusOutlined,
    ArrowRightOutlined
} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
/*
 商品分类管理
*/

export default class Category extends Component {

    state = {
        loading: false,
        categorys: [], //一级分类列表
        subCategorys: [], //二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类Id
        parentName: '', //当前需要显示的分类列表的父分类名称
        showStatus: 0, //标识添加/更新的确认框是否显示，0:都不显示，1显示添加，2显示更新
    }

    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: '300px',
                render: (category) => {
                    return (
                        <span>
                            <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>
                            {/*如何向事件回调函数传递参数*/}
                            {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}
                        </span>
                    )
                }
            },
        ];
    }

    //异步获取一级/二级分类列表
    // parentId:如果没有指定根据状态中的parentId请求，如果指定了根据指定的请求
    getCategorys = async (parentId) => {
        this.setState({
            loading: true
        })

        parentId = parentId || this.state.parentId;

        //发送异步请求 请求数据
        const result = await reqCategorys(parentId);
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            const categorys = result.data

            if (parentId === '0') {
                //更新一级分类状态
                this.setState({
                    categorys: categorys
                })
            } else {
                //更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error('获取分类列表失败')
        }

    }

    //显示指定二级分类列表显示
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            //在状态更新且重新render()后执行
            //获取二级分类列表
            this.getCategorys();
            //setState不能立即获取最新的状态，因为setState是异步更新状态
        })
    }

    //显示指定一级分类列表显示
    showCategorys = () => {
        this.setState({
            parentName: '',
            parentId: '0',
            subCategorys: []
        })
    }

    //响应点击取消：隐藏确认框
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
        this.form.current.resetFields()
    }

    //显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    //显示更新的确认框
    showUpdate = (category) => {
        //  保存分类对象
        this.category = category
        //更新状态
        this.setState({
            showStatus: 2
        })
    }

    //添加分类
    addCategory = async () => {
        this.form.current.validateFields(['categoryName', 'parentId']).then(async (value) => {
            //1.隐藏确认框
            this.setState({
                showStatus: 0
            })
            //2.发更新请求
            const { parentId, categoryName } = value
            const result = await reqAddCategory(categoryName, parentId)

            //3. 重新显示列表
            if (result.status === 0) {
                //添加的分类就是当前分类列表下的分类
                if (parentId === this.state.parentId) {
                    this.getCategorys()
                } else if (parentId === '0') { //在二级分类列表下添加一级分类，重新获取一级分类但不需要显示
                    this.getCategorys('0')
                }
            }
        })
    }


    //更新分类
    updateCategory = async () => {
        //表单验证
        this.form.current.validateFields(['categoryName'])
            .then(async (value) => {
                //1.隐藏确认框
                this.setState({
                    showStatus: 0
                })
                //2.发更新请求
                const categoryId = this.category._id
                const { categoryName } = value
                const result = await reqUpdateCategory({ categoryId, categoryName })

                //3. 重新显示列表
                if (result.status === 0) {
                    this.getCategorys()
                }
            })
            .catch(errInfo => {

            })

    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        //获取一级分类列表
        this.getCategorys()
    }

    render () {

        //card左侧标题
        const title = this.state.parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ marginRight: '10px' }} />
                <span>{this.state.parentName}</span>
            </span>
        )
        //card的右侧
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )

        //
        const { parentId, categorys, subCategorys } = this.state;

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey="_id"
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    loading={this.state.loading} />;

                <Modal
                    title="添加分类"
                    visible={this.state.showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => { this.form = form }} />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={this.state.showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={this.category == null ? '' : this.category.name}
                        setForm={(form) => { this.form = form }} />
                </Modal>
            </Card >
        )
    }
}