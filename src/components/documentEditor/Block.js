import React from 'react';
import {
	Button, Collapse, Dialog, DialogTitle, DialogContent
} from 'material-ui';
import { getPrimary, getSecondary } from '../../styles/colors';
import RichTextInput from '../../displayComponents/RichTextInput';
import { BasicButton } from '../../displayComponents';
import LoadDraft from '../company/drafts/LoadDraft';
import withSharedProps from '../../HOCs/withSharedProps';
import { getDefaultTagsByBlockType } from './utils';


const Block = ({
	expand, setExpand, company, translate, ...props
}) => {
	const [editMode, setEditMode] = React.useState(false);
	const [text, setText] = React.useState(props.column === 2 ? props.value.secondaryText : props.value.text);
	const [draftModal, setDraftModal] = React.useState(false);
	const editor = React.useRef();


	const loadDraft = async draft => {
		const result = await props.editBlock(props.id, draft.text);
		editor.current.paste(result);
		setDraftModal(false);
	};

	const openDraftModal = () => {
		setDraftModal(true);
	};

	const closeDraftModal = () => {
		setDraftModal(false);
	};


	const hoverAndSave = id => {
		if (editMode) {
			props.editBlock(id, text);
		} else {
			setTimeout(() => {
				editor.current.rtEditor.focus();
			}, 150);
		}
		setEditMode(!editMode);
	};


	if (Object.prototype.hasOwnProperty.call(props.value, 'toggleable')) {
		return (
			<div style={{ overflow: 'hidden', padding: '1em 1.5em 1em 1em', width: '100%' }}>
				<BorderBox
					itemInfo={props.value}
					icon={props.value.icon ? props.value.icon : ''}
					id={props.id}
					column={props.column}
					colorBorder={props.value.colorBorder}
					stylesBody={{ width: '100%', margin: '0em' }}
					removeBlock={props.removeBlock}
					toggle={props.value.toggleable}
					noIcon={true}
				>
					<div >
						<div style={{ fontSize: '16px', fontWeight: 'bold' }}>{props.value.label}</div>
					</div>
				</BorderBox>
			</div>
		);
	}

	const renderEditor = () => {
		let placeholder = null;
		let placeholderSecondary = null;
		if (props.value.placeholder === props.value.text) {
			placeholder = props.value.placeholder;
		}
		if (props.value.placeholderSecondary === props.value.secondaryText) {
			placeholderSecondary = props.value.placeholderSecondary;
		}
		return (
			<RichTextInput
				borderless={true}
				ref={editor}
				id={`text-editor-${props.value.type}`}
				value={props.column === 2 ? !placeholderSecondary && props.value.secondaryText : !placeholder && props.value.text}
				placeholder={props.column === 2 ? placeholderSecondary : placeholder}
				translate={translate}
				// tags={generateActTags(null, translate)}
				// errorText={props.state.errors === undefined ? "" : props.state.errors[props.editInfo.originalName]}
				onChange={value => setText(value)}
				loadDraft={
					<BasicButton
						text={translate.load_draft}
						color={getSecondary()}
						textStyle={{
							color: 'white',
							fontWeight: '600',
							fontSize: '0.8em',
							textTransform: 'none',
							marginLeft: '0.4em',
							minHeight: 0,
							lineHeight: '1em'
						}}
						textPosition="after"
						onClick={openDraftModal}
					/>
				}
			/>
		);
	};

	return (
		<div style={{ padding: '1em', paddingRight: '1.5em', width: '100%' }}>
			<div style={{ display: 'flex', fontSize: '19px' }} >
				<div style={{
					color: getPrimary(), fontWeight: 'bold', display: 'flex', paddingRight: '1em',
				}}>
					{props.value.icon ?
						<React.Fragment>
							<div>
								<img src={props.value.icon} />
							</div>
						</React.Fragment>
						: <React.Fragment>
							<div>Aa</div>
							<div>
								<i className="fa fa-i-cursor" aria-hidden="true" />
							</div>
						</React.Fragment>
					}

				</div>
				<div style={{ fontWeight: '700' }}>
					{props.value.label ? translate[props.value.label] || props.value.label : ''}
				</div>
			</div>
			{props.expand ?
				// Este es el que tiene que montar los demas puntos dentro
				<Collapse in={expand} timeout="auto" unmountOnExit>
					<React.Fragment>
						<div style={{ marginTop: '1em' }} dangerouslySetInnerHTML={{
							__html: props.column === 2 ? props.value.secondaryText : props.value.text
						}}>
						</div>
						<div>
							{renderEditor()}
						</div>
					</React.Fragment>
				</Collapse>
				: editMode ?
					<div style={{ marginTop: '1em', cursor: 'default' }} className="editorText">
						{renderEditor()}
					</div>
					: <div
						style={{ marginTop: '1em' }}
						dangerouslySetInnerHTML={{
							__html: props.column === 2 ? props.value.secondaryText : props.value.text
						}}
					/>
			}

			<div style={{ marginTop: '1em' }}>
				{props.value.editButton
					&& <Button
						style={{ color: getPrimary(), minWidth: '0', padding: '0' }}
						onClick={() => hoverAndSave(props.id, text)}
						id={`toggle-editor-${props.value.type}`}
					>
						{/* onClick={props.updateCouncilActa} */}
						{editMode ?
							translate.accept
							: translate.edit
						}
					</Button>
				}
			</div>
			{draftModal
				&& <Dialog
					open={draftModal}
					maxWidth={false}
					onClose={closeDraftModal}
				>
					<DialogTitle>{translate.load_draft}</DialogTitle>
					<DialogContent style={{ width: '800px' }}>
						<LoadDraft
							defaultTags={getDefaultTagsByBlockType(props.value.type, translate)}
							translate={translate}
							loadDraft={loadDraft}
						/>
					</DialogContent>
				</Dialog>
			}
		</div>
	);
};


export const BorderBox = ({
	colorBorder, children, addItem, itemInfo, icon, stylesBody, toggle, removeBlock, id, noIcon, type
}) => (
	<div style={{
		width: '100%', background: 'white', boxShadow: ' 0 2px 4px 5px rgba(0, 0, 0, 0.11)', borderRadius: '4px', margin: '0.8em 0px', ...stylesBody
	}}>
		<div style={{ width: '100%', display: 'flex' }}>
			<div style={{ paddingRight: '4px', background: colorBorder || getPrimary(), borderRadius: '15px' }}></div>
			<div style={{
				marginLeft: '0.5em', paddingTop: '0.8em', paddingBottom: '0.8em', width: '100%'
			}}>
				<div style={{ display: 'flex', width: '100%' }}>
					<div style={{
						color: getPrimary(), fontWeight: 'bold', fontSize: '16px', display: 'flex'
					}}>
						{icon ?
							<React.Fragment>
								<div>
									<img src={icon} />
								</div>
							</React.Fragment>
							: <React.Fragment>
								<div>Aa</div>
								<div>
									<i className="fa fa-i-cursor" aria-hidden="true">
									</i>
								</div>
							</React.Fragment>
						}

					</div>
					<div style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
						<div style={{
							marginLeft: '0.3em', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
						}}>
							{children}
						</div>
						<div style={{
							marginLeft: '0.3em', marginRight: '0.8em', height: '100%', display: 'flex', alignItems: 'center'
						}}>
							{toggle ?
								<span
									style={{ cursor: 'pointer', color: colorBorder }}
									onClick={() => removeBlock(id)}
									id={`remove-block-${itemInfo.type}`}
								>
									{!itemInfo.hide ?
										<i className="fa fa-check-square-o" aria-hidden="true" style={{ color: 'green', fontSize: '20px' }}></i>
										: <i className="fa fa-square-o" aria-hidden="true" style={{ color: 'grey', fontSize: '20px' }}></i>
									}
								</span>
								: !noIcon
								&& <i
									className="material-icons"
									style={{ cursor: 'pointer', color: '#979797' }}
									onClick={() => addItem(id)}
									id={`document-add-block-${type}`}
								>
									arrow_right_alt
								</i>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default withSharedProps()(Block);
