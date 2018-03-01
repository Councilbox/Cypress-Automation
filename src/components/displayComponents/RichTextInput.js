import React, { Component } from 'react';
import {TextField} from 'material-ui';
import RichTextEditor from 'react-rte';


class RichTextField extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: RichTextEditor.createValueFromString(this.props.value, 'html')
        }
    }

    onChange = (value) => {
        this.setState({value});
        if(this.props.onChange) {
            this.props.onChange(
                value.toString('html').replace(/<a /g, '<a target="_blank" ')
            );
        }
    };

    render(){
        return(
            <RichTextEditor
                className={'text-editor'}
                value={this.state.value}
                onChange={this.onChange}
                toolbarConfig={toolbarConfig}
            />
        )
    }
}

const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
      {label: 'Normal', style: 'unstyled'},
      {label: 'Heading Large', style: 'header-one'},
      {label: 'Heading Medium', style: 'header-two'},
      {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'}
    ]
  };

export default RichTextField;

/* 
<TextField
        floatingLabelText={floatingText}
        floatingLabelFixed={true}
        type={type}
        multiLine={true}
        rows={4}
        value={value}
        onChange={onChange}
        errorText={errorText}
    />
*/