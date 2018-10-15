import React, { Component } from "react";

const withWindowSize = WrappedComponent => {
	return class WithWindowSize extends Component {
		state = {
			size: "lg",
			innerHeight: window.innerHeight
		};



		updateSize = () => {
			let state = this.state;
			if (window.innerWidth < 960) {
				state.size = "xs";
			} else if (window.innerWidth < 1200) {
				state.size = "md";
			} else if (window.innerWidth < 1600) {
				state.size = "lg";
			} else {
				state.size =  "xl";
			}

			if (window.innerWidth < window.innerHeight) {
				state.orientation = "portrait";
			} else if (window.innerWidth > window.innerHeight) {
				state.orientation = "landscape";
			}

			state.innerHeight = window.innerHeight;

			this.setState({
				...state
			});


			const element = document.getElementById('root');

			if(element){
				element.style.height = window.innerHeight + 'px';
			}
		};

		componentDidMount() {
			this.updateSize();
			window.addEventListener("resize", this.updateSize);
		}

		componentWillUnmount() {
			window.removeEventListener("resize", this.updateSize);
		}

		render() {
			return (
				<WrappedComponent
					updateSize={this.updateSize}
					orientation={this.state.orientation}
					innherHeight={this.state.innerHeight}
					windowSize={this.state.size}
					{...this.props}
				/>
			);
		}
	};
};

export default withWindowSize;