import React from "react";
import { VOTE_VALUES } from "../../../../constants";
import { agendaVotingsOpened } from '../../../../utils/CBX';
import VotingValueIcon from "./VotingValueIcon";
import { graphql } from "react-apollo";
import { updateAgendaVoting } from "../../../../queries/agenda";
import { MenuItem, Tooltip } from "material-ui";
import { CircularProgress } from "material-ui/Progress";

const PresentVoteMenu = ({ agenda, active, agendaVoting, ...props }) => {
	const [loading, setLoading] = React.useState(false);

	const updateAgendaVoting = async value => {
		setLoading(value);

		await props.updateAgendaVoting({
			variables: {
				agendaVoting: {
					id: agendaVoting.id,
					vote: value
				}
			}
		});

		setLoading(false);
		props.refetch();
	};

	console.log(agendaVoting.author);

	const _block = (value, active) => {
		if(!agendaVotingsOpened(agenda)){
			if(!active){
				return <span />
			}
		}

		return (
			<div
				style={{
					height: "1.75em",
					width: "1.75em",
					marginRight: "0.2em",
					border: `2px solid ${"grey"}`,
					borderRadius: "3px",
					display: "flex",
					cursor: "pointer",
					alignItems: "center",
					justifyContent: "center"
				}}
				onClick={() => updateAgendaVoting(value)}
			>
				<MenuItem
					selected={active}
					style={{
						display: "flex",
						fontSize: "0.9em",
						alignItems: "center",
						justifyContent: "center",
						height: '100%',
						width: '100%',
						padding: 0,
						margin: 0
					}}
				>
					{loading === value?
						<CircularProgress size={12} thickness={7} color={'primary'} style={{marginBottom: '0.35em'}} />
					:
						<VotingValueIcon
							vote={value}
							color={active ? undefined : "grey"}
						/>
					}
				</MenuItem>
			</div>
		);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				marginRight: "0.7em"
			}}
		>
			{agendaVoting.author.voteDenied? //TRADUCCION
				<React.Fragment>
					<Tooltip title={agendaVoting.author.voteDeniedReason}>
						<div>Derecho a voto denegado</div>
					</Tooltip>
				</React.Fragment>

			:
				<React.Fragment>
					{_block(VOTE_VALUES.POSITIVE, active === VOTE_VALUES.POSITIVE)}
					{_block(VOTE_VALUES.NEGATIVE, active === VOTE_VALUES.NEGATIVE)}
					{_block(VOTE_VALUES.ABSTENTION, active === VOTE_VALUES.ABSTENTION)}
				</React.Fragment>
			}
		</div>
	);

}


export default graphql(updateAgendaVoting, {
	name: "updateAgendaVoting"
})(PresentVoteMenu);
