import { withApollo } from 'react-apollo';
import { Switch } from 'material-ui';
import React from 'react';
import { useCouncilLiveActions } from '../../../../hooks/council';


const CommentWallSwitch = ({ council, client, translate, refetch }) => {
	const { loading, setCommentWall } = useCouncilLiveActions({ council, client });

	const toggleWall = async value => {
		await setCommentWall(value);
		refetch();
	};

	return (
		<>
			<Switch
				checked={council.wallActive === 1}
				onClick={event => event.stopPropagation()}
				onChange={event => toggleWall(event.target.checked ? 1 : 0)}
				value="true"
				color="secondary"
			/>
		</>
	)
};

export default withApollo(CommentWallSwitch);
