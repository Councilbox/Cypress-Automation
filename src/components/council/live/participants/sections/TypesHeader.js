import React from 'react';
import { Grid } from '../../../../../displayComponents';
import { PARTICIPANT_TYPE } from '../../../../../constants';
import TypeIcon from '../TypeIcon';
import { getSecondary } from '../../../../../styles/colors';

const selectedStyle = {
	borderBottom: `3px solid ${getSecondary()}`,
	color: getSecondary(),
	fontWeight: '700'
};


const TypesHeader = ({
	translate, setSelected, participantTypeRecount, selected
}) => (
	<React.Fragment>
		<Grid
			spacing={0}
			xs={12}
			lg={12}
			md={12}
			style={{
				width: '100%',
				minHeight: '3em',
				borderBottom: '1px solid gainsboro',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				paddingLeft: '1.5em',
				paddingRight: '2.5em'
			}}
		>
			<div
				onClick={() => {
					setSelected(null);
				}}
				style={{
					cursor: 'pointer',
					...(selected === null ?
						selectedStyle
						: {}
					)
				}}
			>
				<TypeIcon
					color={selected === null ? getSecondary() : 'grey'}
					translate={translate}
					type={'ALL'}
					number={participantTypeRecount.all}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(PARTICIPANT_TYPE.PARTICIPANT);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_TYPE.PARTICIPANT ?
						selectedStyle
						: {}
					)
				}}
			>
				<TypeIcon
					color={selected === PARTICIPANT_TYPE.PARTICIPANT ? getSecondary() : 'grey'}
					translate={translate}
					type={PARTICIPANT_TYPE.PARTICIPANT}
					number={participantTypeRecount.participant}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(PARTICIPANT_TYPE.GUEST);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_TYPE.GUEST ?
						selectedStyle
						: {}
					)
				}}
			>
				<TypeIcon
					color={selected === PARTICIPANT_TYPE.GUEST ? getSecondary() : 'grey'}
					translate={translate}
					type={PARTICIPANT_TYPE.GUEST}
					number={participantTypeRecount.guest}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(PARTICIPANT_TYPE.REPRESENTATIVE);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_TYPE.REPRESENTATIVE ?
						selectedStyle
						: {}
					)
				}}
			>
				<TypeIcon
					color={selected === PARTICIPANT_TYPE.REPRESENTATIVE ? getSecondary() : 'grey'}
					translate={translate}
					type={PARTICIPANT_TYPE.REPRESENTATIVE}
					number={participantTypeRecount.representative}
				/>
			</div>
		</Grid>
	</React.Fragment>
);

export default TypesHeader;
