import React from "react";
import { AlertConfirm, CloseIcon, Grid, GridItem } from "../../displayComponents/index";
import { getPrimary, getSecondary } from "../../styles/colors";
import { IconButton, Paper, Tooltip } from "material-ui";
import { formatSize } from "../../utils/CBX";


const AttachmentItem = ({ attachment, removeAttachment, icon, editName, edit, loading, translate, loadingId, error }) => {
	const [deleteModal, setDeleteModal] = React.useState(false);
	const primary = getPrimary();
	const secondary = getSecondary();

	const removeItem = attachment => {
		removeAttachment(attachment.id);
	}

	return (
		<Paper
			style={{
				width: "100%",
				padding: "1vw",
				paddingRight: '3em',
				marginTop: "0.6em",
				...(attachment.state === 2 ? { backgroundColor: 'whiteSmoke' } : {}),
				...(error ? {
					border: '1px solid red'
				} : {})
			}}
		>
			<Grid>
				<GridItem xs={6}>
					<div
						style={{
							fontWeight: "600",
							fontSize: "1em",
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'row',
						}}
					>
						{attachment.filename}
					</div>
				</GridItem>
				<GridItem xs={4} style={{ fontSize: '0.8em', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>{attachment.state === 2 ? translate.deleted : formatSize(attachment.filesize)}</GridItem>
				{attachment.state !== 2 &&
					<GridItem xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
						{edit && attachment.state !== 2 &&
							<Tooltip title={translate.edit}>
								<div>
									<IconButton
										style={{
											height: "28px",
											outline: 0,
											marginLeft: '0.3em'
										}}
										onClick={event => {
											event.stopPropagation();
											editName(attachment.orderIndex);
										}}
									>
										<i
											className="fa fa-pencil"
											style={{ color: secondary, fontSize: '1.4rem' }}
										/>
									</IconButton>
								</div>
							</Tooltip>
						}
						{(edit || loading) &&
							<CloseIcon
								style={{
									float: "right",
									color: primary
								}}
								loading={loadingId === attachment.id || loading}
								onClick={() => setDeleteModal(true)}
							/>
						}
						{icon && icon}
					</GridItem>
				}
				{error &&
					<>
						<br />
						{error}
					</>
				}
			</Grid>
			<AlertConfirm
				title={translate.attention}
				bodyText={translate.question_delete}
				open={deleteModal}
				buttonAccept={translate.delete}
				buttonCancel={translate.cancel}
				acceptAction={() => removeItem(attachment)}
				requestClose={() => setDeleteModal(false)}
			/>
		</Paper>
	);
}

export default AttachmentItem;
