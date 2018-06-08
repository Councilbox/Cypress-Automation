import React from "react";
import { CloseIcon, Grid, GridItem } from "../../displayComponents/index";
import { getPrimary, getSecondary } from "../../styles/colors";
import { IconButton, Paper, Tooltip } from "material-ui";
import { formatSize } from "../../utils/CBX";

const primary = getPrimary();
const secondary = getSecondary();

const AttachmentItem = ({ attachment, removeAttachment, editName, edit, translate }) => (
	<Paper
		style={{
			width: "100%",
			padding: "1vw",
			marginTop: "0.6em"
		}}
	>
		<Grid spacing={16}>
			<GridItem xs={9}>
				<div
					style={{
						fontWeight: "600",
						fontSize: "1em",
						display: 'flex',
						flexDirection: 'row'
					}}
				>
					{attachment.filename}
					{edit &&
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

				</div>
			</GridItem>
			<GridItem xs={2}>{formatSize(attachment.filesize)}</GridItem>
			<GridItem xs={1}>
				{edit &&
					<CloseIcon
						style={{
							float: "right",
							color: primary
						}}
						onClick={event => {
							event.stopPropagation();
							removeAttachment(attachment.id);
						}}
					/>
				}
			</GridItem>
		</Grid>
	</Paper>
);

export default AttachmentItem;
