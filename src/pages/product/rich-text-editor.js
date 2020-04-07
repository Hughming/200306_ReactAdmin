import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types'

//用来指定商品详情的富文本编辑器组件
export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (html) {//如果有值，根据html格式字符串创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
            }
        }

    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        //返回输入数据的对于html文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render () {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{ border: '1px solid black', minHeight: '200px', paddingLeft: '10px' }}
                    onEditorStateChange={this.onEditorStateChange}
                />
                {/*<textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />*/}
            </div>
        );
    }
}