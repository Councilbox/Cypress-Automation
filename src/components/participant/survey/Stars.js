import React from 'react';

const Stars = ({ name, lowStars, onClick, value, error }) => {
	return (
		<div style={{ display: "inline-block" }}>
			{error && <span style={{ color: 'red', fontWeight: '700', marginBottom: '1em' }}>{error}</span>}
			<form id={"ratingForm" + name}>
				<fieldset className={"rating"}>
					{[...new Array(5)].map((item, index) => (
						<React.Fragment key={`${index}_${name}`}>
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
							<label htmlFor={"star" + (5 - index) + '' + name} className={lowStars ? 'lowStars' : ""}>5 stars</label>
						</React.Fragment>
					))}
				</fieldset>
			</form>
		</div>
	)
}

export default Stars;