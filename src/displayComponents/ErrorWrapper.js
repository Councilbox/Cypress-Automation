import React from "react";

const ErrorWrapper = ({ error }) => (
	<div>
		<span
			style={{
				fontWeight: "700",
				color: "red"
			}}
		>
			{error.code}{" "}
		</span>
		{error.message}
	</div>
);

export default ErrorWrapper;
