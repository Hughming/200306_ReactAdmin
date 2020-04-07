import React, { Component } from 'react';
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message,
} from 'antd'
import {
    PlusOutlined
} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option

/*
 商品主页，默认子路由组件
*/

export default class ProductHome extends Component {

    state = {
        total: 0,//商品总数量
        products: [], //商品的数组
        loading: false,
        searchName: '',//search关键字
        searchType: 'productName',//根据什么字段
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price
            },
            {
                width: 100,
                title: '状态',
                //dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type="primary"
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/*将product对象传给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span >
                    )
                }
            },
        ];
    }

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        //保存pageNum
        this.pageNum = pageNum

        this.setState({ loading: true })

        const { searchName, searchType } = this.state
        //如果搜索关键字有值
        let result;
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
            console.log(result)
        } else {
            result = await reqProducts(pageNum, 3)
        }

        this.setState({ loading: false })
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    //更新商品状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status);
        if (result.status === 0) {
            message.success('更新商品成功');
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getProducts(1)
    }

    render () {

        const { products, total, loading, searchName, searchType } = this.state

        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    value={searchName}
                    style={{ width: 150, margin: '0 15px' }}
                    placeholder='关键字'
                    onChange={event => this.setState({ searchName: event.target.value })} />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span >
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        onChange: this.getProducts,
                    }} />;
            </Card>
        )
    }
}