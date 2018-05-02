import React, { Component, Fragment } from 'react';
import RichTextEditor from 'react-rte';
import { Grid, GridItem } from './index';
import { Typography } from 'material-ui';


class RichTextField extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: RichTextEditor.createValueFromString(this.props.value, 'html')
        }
    }

    componentDidMount(){
        this.setState({
            value: RichTextEditor.createValueFromString(this.props.value, 'html')
        });
    }

    onChange = (value) => {
        this.setState({value});
        if(this.props.onChange) {
            this.props.onChange(
                value.toString('html').replace(/<a /g, '<a target="_blank" ')
            );
        }
    };

    setValue = (value) => {
        this.setState({
            value: RichTextEditor.createValueFromString(value, 'html')
        });
    };

    paste = (text) => {
        let cd = new DataTransfer();
        cd.setData('text/plain', text);
        this.refs.rtEditor.refs.editor._onPaste({
            preventDefault : () => {this.refs.rtEditor.refs.editor.focus();},
            clipboardData  : cd
        });
        //this.refs.rtEditor.refs.editor.focus();
    };

    render(){
        const { tags, errorText, required } = this.props;

        return(
            <Fragment>
                <Typography variant="body1" style={{color: !!errorText? 'red' : 'inherit'}}>
                    {this.props.floatingText}{!!required && '*'}
                </Typography>
                <Grid>
                    <GridItem xs={12} lg={!!tags? 10 : 12} md={!!tags? 10 : 12}>
                        <RichTextEditor
                            ref={'rtEditor'}
                            className={'text-editor'}
                            value={this.state.value}
                            onChange={this.onChange}
                            toolbarConfig={toolbarConfig}
                        />
                    </GridItem>
                    {!!tags &&
                        <GridItem xs={12} lg={2} md={2}>
                            {tags.map((tag) => {
                                return(
                                    <div key={`tag_${tag.label}`} onClick={() => this.paste(tag.value)} style={{width: '100%', padding: '0.2em', border: '1px solid Gainsboro', cursor: 'pointer'}}>
                                        <span>{tag.label}</span>
                                    </div>
                                )
                            })} 
                        </GridItem>
                    }
                </Grid>
            </Fragment>
        )
    }
}

const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'TAGS','BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
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
