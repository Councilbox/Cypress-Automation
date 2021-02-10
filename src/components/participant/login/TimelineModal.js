import React from 'react';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import TimelineSection from '../timeline/TimelineSection';

const TimelineModal = ({ translate, council }) => {
	const [open, setOpen] = React.useState(false);

	const openModal = () => {
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};


	return (
		<React.Fragment>
			<BasicButton
				text="Ver resumen"
				type="flat"
				color="transparent"
				onClick={openModal}
			/>
			<AlertConfirm
				requestClose={closeModal}
				open={open}
				acceptAction={closeModal}
				buttonAccept={translate.accept}
				bodyText={
					<div style={{ height: '60vh' }}>
						<TimelineSection council={council} translate={translate} />
					</div>
				}
				title={`${council.name} - Resumen`}
			/>
		</React.Fragment>
	);
};


export default TimelineModal;
