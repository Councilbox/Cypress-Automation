import React, { Component } from "react";

const withWindowOrientation = WrappedComponent => {
	return class withWindowOrientation extends Component {
		updateOrientation = () => {
			if (window.innerWidth < window.innerHeight) {
				this.setState({ orientation: "portrait" });
			} else if (window.innerWidth > window.innerHeight) {
				this.setState({ orientation: "landscape" });
			}
		};

		constructor(props) {
			super(props);
			this.state = {
				orientation: "landscape"
			};
		}

		componentDidMount() {
			this.updateOrientation();
			window.addEventListener("resize", this.updateOrientation);
		}

		componentWillUnmount() {
			window.removeEventListener("resize", this.updateOrientation);
		}

		render() {
			return (
				<WrappedComponent
					updateOrientation={this.updateOrientation}
					windowOrientation={this.state.orientation}
					{...this.props}
				/>
			);
		}
	};
};

export default withWindowOrientation;
