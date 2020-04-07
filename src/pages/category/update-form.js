import React from "react";
import {
    Form,
    Input
} from 'antd';
import PropTypes from 'prop-types'

// 更新Category的内置Modal组件
export default class UpdateForm extends React.Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    formRef = React.createRef();

    componentWillMount () {
        //将form对象通过setForm()传递给父组件
        this.props.setForm(this.formRef)
    }

    componentDidUpdate () {
        const { categoryName } = this.props;
        this.formRef.current.setFieldsValue({ categoryName })
    }

    render () {
        const { categoryName } = this.props;
        return (
            <Form
                ref={this.formRef}
                initialValues={{
                    categoryName: categoryName
                }}>
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