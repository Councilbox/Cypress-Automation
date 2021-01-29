import React from "react";
import {
	Link,
} from "../../displayComponents";

class ContentButtonDirectAccess extends React.Component {
	render() {
		const { children, disabled, disabledOnClick, link } = this.props;

		const card =
			<div
				style={{
					...(!disabled ? {} : { filter: 'grayscale(80%)' })
				}}
			>
				{children}
			</div>


		return (
			<React.Fragment>
				{disabled ?
					<div onClick={disabledOnClick}>
						{card}
					</div>
					:
					<Link to={link}>
						{card}
					</Link>
				}
			</React.Fragment>
		);
	}
}

export default ContentButtonDirectAccess;
