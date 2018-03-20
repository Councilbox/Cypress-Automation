import React, { Component } from 'react';

const withWindowSize = (WrappedComponent) => {
    return class WithWindowSize extends Component {
        constructor(props){
            super(props);
            this.state = {
                size: 'lg'
            }
        }

        updateSize = () => {
            if(window.innerWidth < 500) {
                this.setState({ size: 'xs' });
            }else if(window.innerWidth < 700) {
                this.setState({ size: 'md' });
            }else{
                this.setState({ size: 'lg' });
            }
        }

        render(){
            return(
                <WrappedComponent
                    updateSize={this.updateSize}
                    size={this.state.size}
                    {...this.props} 
                />
            )
        }
    }
}


export default withWindowSize;
