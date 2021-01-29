import React from 'react';

const Stars = ({ num, lowStars }) => {
	const [state, setState] = React.useState({})

	return (
		<div style={{ display: "inline-block" }}>
			<form id={"ratingForm" + num}>
				<fieldset className={"rating"}>
					<input type="radio" id={"star5" + num} name={"rating2" + num} value="5" /><label for={"star5" + num} className={lowStars ? 'lowStars' : ""}>5 stars</label>
					<input type="radio" id={"star4" + num} name={"rating2" + num} value="4" /><label for={"star4" + num} className={lowStars ? 'lowStars' : ""}>4 stars</label>
					<input type="radio" id={"star3" + num} name={"rating2" + num} value="3" /><label for={"star3" + num} className={lowStars ? 'lowStars' : ""}>3 stars</label>
					<input type="radio" id={"star2" + num} name={"rating2" + num} value="2" /><label for={"star2" + num} className={lowStars ? 'lowStars' : ""}>2 stars</label>
					<input type="radio" id={"star1" + num} name={"rating2" + num} value="1" /><label for={"star1" + num} className={lowStars ? 'lowStars' : ""}>1 star</label>
				</fieldset>
			</form>
		</div>
	)
}

export default Stars;