import React, { Component } from 'react';
import {
    Card,
    List,
} from 'antd'
import {
    ArrowLeftOutlined
} from '@ant-design/icons'
import LinkButton from '../../components/link-button';
import { BASE_IMG_URL } from '../../utils/constants';
import { reqCategory } from '../../api';

const Item = List.Item

/*
 商品的 详情
*/

export default class ProductDetail extends Component {

    state = {
        cName1: '', //一级分类名称
        cName2: '', //二级分类名称
    }

    async componentDidMount () {
        const { pCategoryId, categoryId } = this.props.location.state
        if (pCategoryId === '0') {//一级分类下的商品
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else { //二级分类下的商品
            //效率低
            /*const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name*/

            //一次性发送多个请求
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }

    }

    render () {
        //读取携带过来的state数据
        const { name, desc, price, detail, imgs } = this.props.location.state
        const { cName1, cName2 } = this.state

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{ color: 'green', marginRight: '15px', fontSize: '20px' }}
                        onClick={() => this.props.history.goBack()} />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <div>
                            <span className="left">商品名称：</span>
                            <span>{name}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品描述：</span>
                            <span>{desc}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品价格：</span>
                            <span>{price}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">所属分类：</span>
                            <span>{cName1} {cName2 ? '--> ' + cName2 : ''}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品图片：</span>
                            <span>
                                {
                                    imgs.map(img => (
                                        <img
                                            key={img}
                                            className="product-img"
                                            src={BASE_IMG_URL + img}
                                            alt="img" />
                                    ))
                                }
                            </span>
                        </div>
                    </Item>
                    <Item>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <span className="left">商品详情：</span>
                            <span dangerouslySetInnerHTML={{ __html: detail }}>

                            </span>
                        </div>
                    </Item>
                </List>
            </Card>
        )
    }
}