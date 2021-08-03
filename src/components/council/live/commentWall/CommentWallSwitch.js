import { withApollo } from 'react-apollo';
import { Switch } from 'material-ui';
import React from 'react';
import { useCouncilLiveActions } from '../../../../hooks/council';
import { AlertConfirm } from '../../../../displayComponents';


const CommentWallSwitch = ({ council, client, translate, refetch }) => {
	const [modal, setModal] = React.useState(false);
	const { loading, setCommentWall } = useCouncilLiveActions({ council, client });

	const toggleWall = async value => {
		await setCommentWall(value);
		setModal(false);
		await refetch();
	};

	return (
		<>
			<AlertConfirm
				open={modal}
				loadingAction={loading}
				requestClose={() => setModal(false)}
				title={council.wallActive === 1 ? translate.disable_wall : translate.enable_wall}
				acceptAction={() => toggleWall(council.wallActive === 1 ? 0 : 1)}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={
					<>
						{council.wallActive === 1 ?
							translate.disable_wall_warning
							:
							translate.enable_wall_warning
						}
					</>
				}
			/>
			<Switch
				disabled={loading}
				checked={council.wallActive === 1}
				onClick={event => event.stopPropagation()}
				onChange={() => setModal(true)}
				value="true"
				color="secondary"
			/>
		</>
	);
};

export default withApollo(CommentWallSwitch);
