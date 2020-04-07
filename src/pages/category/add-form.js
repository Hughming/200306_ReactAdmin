import React from "react";
import {
    Form,
    Select,
    Input
} from 'antd';
import PropTypes from 'prop-types'

const Option = Select.Option;


// 添加Category的内置Modal组件
export default class AddForm extends React.Component {

    static propTypes = {
        categorys: PropTypes.array.isRequired, //一级分类列表
        parentId: PropTypes.string.isRequired, //父分类Id
        setForm: PropTypes.func.isRequired
    }

    formRef = React.createRef();

    componentWillMount () {
        this.props.setForm(this.formRef)
    }

    componentDidUpdate () {
        this.formRef.current.setFieldsValue({ parentId: this.props.parentId })
    }

    render () {
        return (
            <Form
                ref={this.formRef}
                initialValues={{
                    parentId: this.props.parentId
                }}>
                <Form.Item name="parentId">
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            this.props.categorys.map(c => <Option value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    name="categoryName"
                    rules={[
                        { required: true, message: '分类名称必须输入' },
                    ]}>
                    <Input placeholder='请输入分类名称'></Input>
                </Form.Item>

            </Form >
        )
    }
}