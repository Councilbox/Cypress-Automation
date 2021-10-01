import React from 'react';
import { isMobile } from '../../../../../utils/screen';
import { Grid } from '../../../../../displayComponents';
import { PARTICIPANT_STATES } from '../../../../../constants';
import { getSecondary } from '../../../../../styles/colors';
import StateIcon from '../StateIcon';

const selectedStyle = {
	borderBottom: `3px solid ${getSecondary()}`,
	color: getSecondary(),
	fontWeight: '700'
};


const StatesHeader = ({
	translate, setSelected, stateRecount, selected
}) => (
	<React.Fragment>
		<Grid
			style={{
				width: '100%',
				minHeight: '3em',
				borderBottom: '1px solid gainsboro',
				display: isMobile ? 'grid' : 'flex',
				gridTemplateColumns: isMobile && 'repeat(auto-fit, minmax(80px, auto))',
				flexDirection: !isMobile && 'row',
				alignItems: 'center',
				justifyContent: !isMobile && 'space-between',
				paddingLeft: '1.5em',
				paddingRight: isMobile ? '1.5em' : '2.5em',
				margin: 0,
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
				<StateIcon
					color={selected === null ? getSecondary() : 'grey'}
					translate={translate}
					state={'ALL'}
					number={stateRecount.all}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						PARTICIPANT_STATES.NO_PARTICIPATE
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_STATES.NO_PARTICIPATE ?
						selectedStyle
						: {}
					)
				}}
			>
				<StateIcon
					color={selected === PARTICIPANT_STATES.NO_PARTICIPATE ? getSecondary() : 'grey'}
					translate={translate}
					state={PARTICIPANT_STATES.NO_PARTICIPATE}
					number={stateRecount.noParticipate}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(PARTICIPANT_STATES.REMOTE);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_STATES.REMOTE ?
						selectedStyle
						: {}
					)
				}}
			>
				<StateIcon
					color={selected === PARTICIPANT_STATES.REMOTE ? getSecondary() : 'grey'}
					translate={translate}
					state={PARTICIPANT_STATES.REMOTE}
					number={stateRecount.remote}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						PARTICIPANT_STATES.PHYSICALLY_PRESENT
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_STATES.PHYSICALLY_PRESENT ?
						selectedStyle
						: {}
					)
				}}
			>
				<StateIcon
					color={selected === PARTICIPANT_STATES.PHYSICALLY_PRESENT ? getSecondary() : 'grey'}
					translate={translate}
					state={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
					number={stateRecount.present}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE ?
						selectedStyle
						: {}
					)
				}}
			>
				<StateIcon
					translate={translate}
					color={selected === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE ? getSecondary() : 'grey'}
					state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE}
					number={stateRecount.presentWithElectronicVote}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(PARTICIPANT_STATES.DELEGATED);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_STATES.DELEGATED ?
						selectedStyle
						: {}
					)
				}}
			>
				<StateIcon
					translate={translate}
					color={selected === PARTICIPANT_STATES.DELEGATED ? getSecondary() : 'grey'}
					state={PARTICIPANT_STATES.DELEGATED}
					number={stateRecount.delegated}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						PARTICIPANT_STATES.REPRESENTATED
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === PARTICIPANT_STATES.REPRESENTATED ?
						selectedStyle
						: {}
					)
				}}
			>
				<StateIcon
					translate={translate}
					color={selected === PARTICIPANT_STATES.REPRESENTATED ? getSecondary() : 'grey'}
					state={PARTICIPANT_STATES.REPRESENTATED}
					number={stateRecount.representated}
				/>
			</div>
		</Grid>
	</React.Fragment>
);

export default StatesHeader;
