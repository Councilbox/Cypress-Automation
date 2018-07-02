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


    render(){
        const {
            trigger = "hover",
            translate,
            title = 'title',
            content = 'content',
            children,
            visible = true,
            TriggerComponent = DefaultTrigger,
        } = this.props;

        return(
            <Popover
                title={<span style={{userSelect: "none"}}>{title}</span>}
                content={<span style={{userSelect: "none"}}>{content}</span>}
                visible={this.state.visible}
                onVisibleChange={this.onVisibleChange}
                trigger={'hover'}
            >
                <TriggerComponent onClick={this.toggleVisible} />
            </Popover>
        )
    }
}

const DefaultTrigger = ({ onClick }) => (
    <span
        onClick={onClick}
        style={{
            borderRadius: '1em',
            color: getSecondary(),
            cursor: 'pointer',
            fontSize: '0.82em',
            border: `1px solid ${getSecondary()}`,
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
