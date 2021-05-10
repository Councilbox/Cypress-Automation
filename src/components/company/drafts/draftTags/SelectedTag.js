import React from 'react';
import { Tooltip } from 'material-ui';
import { isMobile } from '../../../../utils/screen';


const SelectedTag = ({
	text, color, action, list, count, stylesEtiqueta, id, desplegarEtiquetas, mouseEnterHandler, mouseLeaveHandler, sinTitulos, props
}) => {
	const anchoRef = React.useRef();
	const [tooltip, setTooltip] = React.useState(false);

	React.useLayoutEffect(() => {
		if (anchoRef.current.clientWidth > (15 * 12) && !tooltip) {
			setTooltip(true);
		}
	});


	if (list) {
		return (
			<React.Fragment>
				<div style={{ visibility: 'hidden', position: 'absolute' }} ref={anchoRef}>{text}</div>
				<div
					className={count && 'hoverTags'}
					style={{
						borderRadius: '20px',
						background: color,
						display: 'inline-block',
						marginRight: '0.5em',
						marginTop: '0.25em',
						marginBottom: '0.25em',
						padding: '8px',
						maxWidth: '150px',
						...stylesEtiqueta,
						color,
						position: sinTitulos && 'relative',
					}}
					onClick={event => desplegarEtiquetas && desplegarEtiquetas(event)}
					onMouseEnter={mouseEnterHandler || function () { return false; }}
					onMouseLeave={mouseLeaveHandler || function () { return false; }}
				>
					{sinTitulos ?
						count &&
						<div style={{
							color: 'white', position: 'absolute', top: '-8px', left: '0px'
						}}>
							+{count}
						</div>
						:
						<div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
							{tooltip ?
								<Tooltip title={text}>
									<div style={{ paddingRight: '0.5em', maxWidth: props.innerWidth < 1190 ? isMobile ? '' : '11em' : '15em' }} className="truncate">{text}</div>
								</Tooltip>
								:
								<div style={{ paddingRight: '0.5em', maxWidth: props.innerWidth < 1190 ? isMobile ? '' : '11em' : '15em' }} className="truncate">{text}</div>
							}
							{count &&
								<div>
									<div style={{
										background: 'white', color, borderRadius: '50%', width: '20px', paddingLeft: '2px', fontWeight: '900'
									}}>
										+{count}
									</div>
								</div>
							}
						</div>
					}
				</div>
			</React.Fragment>
		);
	}
	return (
		<React.Fragment>
			<div style={{ visibility: 'hidden', position: 'absolute' }} ref={anchoRef}>{text}</div>
			<div
				id={id}
				style={{
					borderRadius: '20px',
					background: color,
					display: 'inline-block',
					marginRight: '0.5em',
					marginTop: '0.25em',
					marginBottom: '0.25em',
					color: 'white',
					padding: '8px'
				}}
			>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					{tooltip ?
						<Tooltip title={text}>
							<div style={{ paddingRight: '0.5em', maxWidth: props.innerWidth < 1190 ? isMobile ? '' : '11em' : '15em' }} className="truncate">{text}</div>
						</Tooltip>
						:
						<div style={{ paddingRight: '0.5em', maxWidth: props.innerWidth < 1190 ? isMobile ? '' : '11em' : '15em' }} className="truncate">{text}</div>
					}
					<div>
						<i
							className="fa fa-times"
							style={{
								cursor: 'pointer', background: ' #ffffff', color, borderRadius: '6px', padding: '0em 1px'
							}}
							aria-hidden="true"
							onClick={action}
						>
						</i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default SelectedTag;
