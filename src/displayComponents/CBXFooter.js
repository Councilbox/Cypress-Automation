import React from 'react';
import { darkGrey } from '../styles/colors';
import { CLIENT_VERSION } from '../config';
import { isMobile } from '../utils/screen';

const date = new Date();

const year = date.getFullYear();

const CBXFooter = ({ style = {} }) => (
	<div style={{
		fontSize: '11px',
		marginTop: isMobile ? '1.2em' : '0.2em',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '1em',
		...style
	}}>
		<div
			dangerouslySetInnerHTML={{ __html: `Copyright &copy ${year}` }}
		/>
		<span style={{ marginLeft: '0.2em', marginRight: '0.2em', color: darkGrey }}>
			v<span id="client-version">{CLIENT_VERSION}</span>{' - '}
			<a href="https://www.councilbox.com" rel="noreferrer noopener">
				Councilbox Technology S.L.
			</a>
		</span>
	</div>
);

export default CBXFooter;
