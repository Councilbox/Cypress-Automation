import React from 'react';

const Stars = ({ name, lowStars, onClick, value }) => {
	return (
		<div style={{ display: "inline-block" }}>
			<form id={"ratingForm" + name}>
				<fieldset className={"rating"}>
					{[...new Array(5)].map((item, index) => (
						<>
							<input
								type="radio"
								id={"star" + (5 - index) + '' + name}
								name={"rating2" + name}
								checked={value === (5 - index)}
								value={5 - index}
								onChange={event => {
									onClick(event.target.value);
								}}
							/>
							<label for={"star"+ (5 - index) + '' + name} className={lowStars ? 'lowStars' : ""}>5 stars</label>
						</>
					))}
				</fieldset>
			</form>
		</div>
	)
}

export default Stars;