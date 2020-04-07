import React, { Component } from 'react';
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button
} from 'antd';
import LinkButton from '../../components/link-button';
import {
    ArrowLeftOutlined
} from '@ant-design/icons'
import { reqCategorys } from '../../api'
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'

const { Item } = Form;
const { TextArea } = Input;

/*
 商品的添加和更新子路由组件
*/

export default class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
        };
        this.formRef = React.createRef();
        this.pw = React.createRef();
        this.editor = React.createRef();
    }

    //async函数返回值是一个promise对象
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId);
        if (result.status === 0) {
            const categorys = result.data;
            //如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys);
            } else {
                //二级列表
                return categorys
            }
        }
    }

    initOptions = async (categorys) => {
        //根据categorys生产options
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        //如果是一个二级分类商品的更新
        const { isUpdate, product } = this;
        const { pCategoryId, categoryId } = product;
        if (isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId);
            //生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))

            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId);

            //关联到对应的一级option
            targetOption.children = childOptions;
        }

        //更新状态
        this.setState({
            options
        })
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        //  根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value);
        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            //关联到targetOption上
            targetOption.children = childOptions;
        } else {
            //没二级分类
            targetOption.isLeaf = true;
        }

        //更新状态
        targetOption.loading = false;
        this.setState({
            options: [...this.state.options],
        });

    };

    submit = () => {
        //表单验证
        this.formRef.current.validateFields(['name'])
            .then((values) => {
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                //console.log(detail)
            })
            .catch((errInfo) => {

            })
    }

    validatePrice = (rule, value) => {
        if (value * 1 > 0) {
            return Promise.resolve()
        }
        return Promise.reject('价格必须大于0')
    }

    componentWillMount () {
        //取出携带的数据
        const product = this.props.location.state;//如果是添加没值，否则有值
        //保存是否是更新的标识
        this.isUpdate = !!product;
        this.product = product || {}
    }

    componentDidMount () {
        this.getCategorys('0');
    }

    render () {
        const { isUpdate, product } = this;
        const { pCategoryId, categoryId, imgs, detail } = product;
        //用来接收级联分类Id的数组
        const categoryIds = [];
        if (isUpdate) {
            //商品是一个一级分类的商品
            if (pCategoryId === '0') {
                categoryIds.push(categoryId);
            } else {
                //商品是一个二级分类的商品
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 }, //左侧label的宽度
            wrapperCol: { span: 8 } // 右侧包裹的宽度
        }

        return (
            <Card title={title}>
                <Form
                    {...formItemLayout}
                    ref={this.formRef}
                    initialValues={{
                        name: product.name || '',
                        desc: product.desc || '',
                        price: product.price || null,
                        categoryIds,
                    }}
                >
                    <Item
                        label="商品名称"
                        name='name'
                        rules={[
                            { required: true, message: '必须输入商品名称' }
                        ]}
                    >
                        <Input placeholder="请输入商品名称" />
                    </Item>
                    <Item
                        label="商品描述"
                        name='desc'
                        rules={[
                            { required: true, message: '必须输入商品描述' }
                        ]}
                    >
                        <TextArea placeholder="请输入商品描述" autoSize />
                    </Item>
                    <Item
                        label="商品价格"
                        name='price'
                        rules={[
                            { required: true, message: '必须输入商品价格' },
                            { validator: this.validatePrice }
                        ]}
                    >
                        <Input
                            type='number'
                            placeholder="请输入商品价格"
                            addonAfter="元"
                        />
                    </Item>
                    <Item
                        label="商品分类"
                        name='categoryIds'
                        rules={[
                            { required: true, message: '必须指定商品分类' },
                        ]}
                    >
                        <Cascader
                            placeholder='请指定商品分类'
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item
                        label="商品图片"
                        name='imgs'
                    >
                        <PictureWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}> 提交</Button>
                    </Item>
                </Form>
            </Card >
        )
    }
}