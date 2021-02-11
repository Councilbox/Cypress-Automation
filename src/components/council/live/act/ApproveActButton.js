import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, Icon } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import { approveAct } from '../../../../queries';

const ApproveActButton = ({
	translate, council, client, refetch
}) => {
	const primary = getPrimary();

	const finishAct = async () => {
		await client.mutate({
			mutation: approveAct,
			variables: {
				councilId: council.id,
				closeCouncil: true
			}
		});

		refetch();
	};

	return (
		<BasicButton
			text={translate.finish_and_aprove_act}
			color={primary}
			textPosition="before"
			onClick={finishAct}
			icon={
				<Icon
					className="material-icons"
					style={{
						fontSize: '1.1em',
						color: 'white'
					}}
				>
play_arrow
				</Icon>
			}
			textStyle={{
				color: 'white',
				fontSize: '0.7em',
				fontWeight: '700',
				textTransform: 'none'
			}}
		/>
	);
};


export default withApollo(ApproveActButton);
