import React, { Component } from 'react';

const withWindowSize = (WrappedComponent) => {
    return class WithWindowSize extends Component {
        updateSize = () => {
            if (window.innerWidth < 960) {
                this.setState({ size: 'xs' });
            } else if (window.innerWidth < 1200) {
                this.setState({ size: 'md' });
            } else if (window.innerWidth < 1600) {
                this.setState({ size: 'lg' });
            } else {
                this.setState({ size: 'xl' });
            }
        };

        constructor(props) {
            super(props);
            this.state = {
                size: 'lg'
            }
        }

        componentDidMount() {
            this.updateSize();
            window.addEventListener('resize', this.updateSize);
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.updateSize);
        }

        render() {
            return (<WrappedComponent
                updateSize={this.updateSize}
                windowSize={this.state.size}
                {...this.props}
            />)
        }
    }
};


export default withWindowSize;
