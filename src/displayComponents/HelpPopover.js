import React from 'react';
import Popover from 'antd/lib/popover';
import 'antd/lib/popover/style/index.css';
import { getSecondary } from '../styles/colors';

class HelpPopover extends React.Component {

    state = {
        visible: false
    };

    onVisibleChange = visible => {
        this.setState({
            visible
        });
    }

    toggleVisible = () => {
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

const DefaultTrigger = ({ onClick, colorFail }) => (
    <span
        onClick={onClick}
        style={{
            borderRadius: '1em',
            color: colorFail ? "#f44336" : getSecondary(),
            cursor: 'pointer',
            fontSize: '0.82em',
            border: colorFail ? `1px solid #f44336` : `1px solid ${getSecondary()}`,
            width: '1.1em',
            height: '1.1em',
            marginLeft: '0.4em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        ?
    </span>
)

export default HelpPopover;
