import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

class ReadMore extends React.Component {
    state = {
        expanded: false,
        truncated: false
    };

    handleTruncate = (truncated) => {
        if (this.state.truncated !== truncated) {
            this.setState({
                truncated
            });
        }
    }

    toggleLines = (event) => {
        event.preventDefault();

        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        const {
            children,
            more,
            less,
            lines
        } = this.props;

        const { expanded, truncated } = this.state;

        return (
            <div>
                <Truncate
                    lines={!expanded && lines}
                    ellipsis={(
                        <span>... <a onClick={this.toggleLines}>{more}</a></span>
                    )}
                    onTruncate={this.handleTruncate}
                >
                    <div onClick={this.toggleLines}>
                        {children}
                    </div>
                </Truncate>
                {!truncated && expanded && (
                    <span> <a onClick={this.toggleLines}>{less}</a></span>
                )}
            </div>
        );
    }
}

ReadMore.propTypes = {
    children: PropTypes.node.isRequired,
    text: PropTypes.node,
    lines: PropTypes.number
};

export default ReadMore;