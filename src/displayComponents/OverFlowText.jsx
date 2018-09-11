import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import FontAwesome from "react-fontawesome";
import { secondary } from "../styles/colors";

function isTextOverflow(element) {
	return element.clientWidth < element.scrollWidth;
}

export default class OverflowText extends React.Component {
	state = {
		overflow: false,
		children: null
	};

	componentDidMount() {
		this.checkOverflow();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.children !== prevState.children){
			return nextProps.children;
		}
		return null;
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.children !== prevState.children) {
			this.checkOverflow();
		}
	}

	checkOverflow() {
		const element = ReactDOM.findDOMNode(this);

		const overflow = isTextOverflow(element);
		if (overflow !== this.state.overflow) {
			this.setState({ overflow: overflow });
		}
	}

	render() {
		const { icon, action } = this.props;
		return (
			<React.Fragment>
				{this.state.overflow && (
					<FontAwesome
						name={icon}
						style={{
							position: "absolute",
							right: "0px",
							bottom: "20px",
							cursor: "pointer",
							color: secondary
						}}
						onClick={action}
					/>
				)}
				{this.props.children}
			</React.Fragment>
		);
	}
}

OverflowText.displayName = "OverflowText";
OverflowText.propTypes = {
	icon: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired
};
