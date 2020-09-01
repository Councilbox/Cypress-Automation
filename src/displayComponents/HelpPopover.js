import React from 'react';
import Popover from 'antd/lib/popover';
import 'antd/lib/popover/style/index.css';
import { getSecondary, getPrimary } from '../styles/colors';

class HelpPopover extends React.Component {

    state = {
        visible: false
    };

    onVisibleChange = visible => {
        this.setState({
            visible
        });
    }

    toggleVisible = event => {
        event.stopPropagation();
        this.setState({
            visible: !this.state.visible
        });
    }


    render() {
        const {
            title = 'title',
            content = 'content',
            TriggerComponent = DefaultTrigger,
            errorText
        } = this.props;
        
        return (
            <Popover
                title={<span style={{ userSelect: "none" }}>{title}</span>}
                content={<span style={{ userSelect: "none" }}>{content}</span>}
                visible={this.state.visible}
                onVisibleChange={this.onVisibleChange}
                trigger={'hover'}
            >
                <TriggerComponent
                    onClick={this.toggleVisible}
                    colorFail={errorText}
                />
            </Popover>
        )
    }
}

const DefaultTrigger = ({ onClick, colorFail }) => {
    const primary = getPrimary();

    return (
        <span onClick={onClick}>
            <i className="material-icons" style={{
                color: primary,
                fontSize: '14px',
                paddingRight: "0.3em",
                cursor: "pointer",
                marginLeft: "5px"
            }} >
                help
            </i>
        </span>

    )
}

export default HelpPopover;
