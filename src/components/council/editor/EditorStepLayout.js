import React from 'react';
import { Scrollbar } from '../../../displayComponents';


class EditorStepLayout extends React.Component {
    state = {
        stick: true
    }

    scrollbar = null;

    componentDidUpdate() {
        if (this.scrollbar) {
            if (this.state.stick) {
                // this.scrollbar.scrollToBottom();
            }
            const values = this.scrollbar.getValues();
            if (values.clientHeight === values.scrollHeight && !this.state.stick) {
                this.setState({
                    stick: true
                });
            }
        }
    }

    updateStickToBottom = () => {
        const values = this.scrollbar.getValues();

        if (values.top + 0.01 > 1) {
            this.setState({
                stick: true
            });
        } else {
            this.setState({
                stick: false
            });
        }
    }

    render() {
        const { body, buttons } = this.props;

        return (
            <div
                style={{
                    width: '100%',
                    height: 'calc(100% - 4em)'
                }}
            >
                <div style={{
 height: '100%', overflow: 'hidden', position: 'relative', borderTop: '1px solid gainsboro',
}}>
                    <Scrollbar
                        ref={ref => {
                            this.scrollbar = ref;
                        }}
                        onScrollStop={() => this.updateStickToBottom()}
                    >
                        <div style={{ padding: '1.2em' }}>
                            {body}
                        </div>
                    </Scrollbar>
                </div>
                <div style={{
 height: '3.5em', borderTop: '1px solid gainsboro', paddingRight: '0.8em', width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'
}}>
                    {buttons}
                </div>
            </div>
        );
    }
}

export default EditorStepLayout;
