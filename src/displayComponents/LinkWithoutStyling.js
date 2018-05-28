import React from "react";
import { Link } from "react-router-dom";

export default ({ to, children }) => (
	<Link
		to={to}
		style={{
			textDecoration: "none",
			color: "inherit"
		}}
	>
		{children}
	</Link>
);
