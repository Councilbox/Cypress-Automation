import React from "react";
import { Grid, GridItem } from "./index";
import { Typography, MenuItem, TableRow, TableHead, Table, TableBody, TableCell, IconButton } from "material-ui";
import { getSecondary, getPrimary } from "../styles/colors";
import FontAwesome from 'react-fontawesome';
import { removeHTMLTags } from '../utils/CBX';
// import RichTextEditor from 'react-rte';
import { isChrome } from 'react-device-detect';
import { withApollo } from 'react-apollo';
import DropDownMenu from './DropDownMenu';
import Icon from './Icon';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import withSharedProps from "../HOCs/withSharedProps";
import { query } from "../components/company/drafts/companyTags/CompanyTags";
import TextInput from "./TextInput";
import { Divider } from "material-ui";
import Scrollbar from "./Scrollbar";
import CloseIcon from "./CloseIcon";
import { useHoverRow } from "../hooks";


if (isChrome) {
	let style = document.createElement("style");
	style.innerHTML = '.ql-editor{white-space: normal !important;}';
	document.head.appendChild(style);
}


var AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);

class RichTextInput extends React.Component {
	state = {
		value: this.props.value,
		showTags: false
	};

	componentDidMount() {
		this.setState({
			value: this.props.value
		});

	}

	changeShowTags = () => {
		this.setState({
			showTags: !this.state.showTags
		});
	};

	onChange = value => {
		if (!this.rtEditor) {
			return;
		}
		this.setState({ value });
		const html = value.toString('html');
		if (this.props.onChange) {
			if (removeHTMLTags(html).length > 0) {
				this.props.onChange(
					html.replace(/<a /g, '<a target="_blank" ')
				);
			} else {
				this.props.onChange('');
			}
		}
	};

	setValue = value => {
		this.setState({
			value: value
		});
	};

	paste = text => {
		const quill = this.rtEditor.getEditor();
		let selection = quill.getSelection();
		if (!selection) {
			this.rtEditor.focus();
			selection = quill.getSelection();
		}
		quill.clipboard.dangerouslyPasteHTML(selection.index, text);
		setTimeout(() => {
			this.rtEditor.focus();
			quill.setSelection(selection.index + removeHTMLTags(text).length, 0);
		}, 500);
	};

	render() {
		const { tags, loadDraft, errorText, required, translate, styles } = this.props;
		const modules = {
			toolbar: {
				container: [
					[{ 'color': [] }, { 'background': [] }], ['bold', 'italic', 'underline', 'link', 'strike'],
					['blockquote', 'code-block', { 'list': 'ordered' }, { 'list': 'bullet' }],
					[{ 'header': 1 }, { 'header': 2 }],
					[{ 'align': 'justify' }], ['custom']
				],
				handlers: {
					// 'custom': (...args) => {
					// 	console.log(args);
					// 	console.log(document.getElementById('pruebas'));
					// 	//this.setState({ showTags: true })
					// }
				}
			},
			clipboard: {
				matchVisual: false,
			}
		};

		if (styles) {
			let style = document.createElement("style");
			style.innerHTML = `.ql-editor{ ${styles} }`;
			document.head.appendChild(style);
		}


		return (
			<React.Fragment>
				<Typography
					variant="body1"
					style={{ color: !!errorText ? "red" : "inherit" }}
				>
					{this.props.floatingText}
					{!!required && "*"}
					{!!errorText &&
						<FontAwesome
							name={"times"}
							style={{
								fontSize: "13px",
								color: 'red',
								marginLeft: '0.2em'
							}}
						/>
					}
				</Typography>
				<Grid>
					<GridItem xs={12}>
						<div
							style={{
								marginTop: "0.7em",
								marginBottom: "-0.7em",
								paddingRight: "0.8em"
							}}
						>
							{
								<React.Fragment>
									<div
										style={{
											display: "flex",
											float: "right",
										}}
									>
										<div style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-end'
										}}>
											{!!tags &&
												<SmartTags
													tags={tags}
													open={this.state.showTags}
													translate={translate}
													requestClose={() => this.setState({ showTags: false })}
													paste={this.paste}
												/>
											}
											<div>
												{!!loadDraft && loadDraft}
											</div>
											{!!this.props.saveDraft &&
												this.props.saveDraft
											}
										</div>
									</div>
								</React.Fragment>
							}
						</div>
						<div
							onClick={event => {
								if (event.target.className === 'ql-custom') {
									this.setState({
										showTags: event.target
									})
								}
							}}
						>
							<ReactQuill
								value={this.state.value}
								onChange={this.onChange}
								modules={modules}
								ref={editor => this.rtEditor = editor}
								id={this.props.id}
								className={`text-editor ${!!errorText ? 'text-editor-error' : ''}`}
							/>
						</div>
					</GridItem>
				</Grid>
			</React.Fragment>
		);
	}
}


const SmartTags = withApollo(withSharedProps()(({ open, requestClose, company, translate, tags, paste, client }) => {
	const primary = getPrimary();
	const [companyTags, setCompanyTags] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [ocultar, setOcultar] = React.useState(false);
	const [searchModal, setSearchModal] = React.useState("");
	const [filteredTags, setFilteredTags] = React.useState(tags);


	React.useEffect(() => {
		if(searchModal){
			setFilteredTags([...tags, ...companyTags].filter(tag => (tag.label && tag.label.toLowerCase().includes(searchModal)) || (tag.key && tag.key.toLowerCase().includes(searchModal))));
		} else {
			let newTags = tags;
			if(companyTags){
				newTags = [...newTags, ...companyTags];
			}
			setFilteredTags(newTags);
		}
	}, [searchModal, companyTags]);

	const loadCompanyTags = React.useCallback(async () => {
		const response = await client.query({
			query,
			variables: {
				companyId: company.id,
				...(searchModal ? {
					filters: [
						{
							field: "key",
							text: searchModal
						},
					]
				} : {}),
			}
		});
		setLoading(false);
		setCompanyTags(response.data.companyTags);
	}, [company.id, searchModal]);

	React.useEffect(() => {
		loadCompanyTags();
	}, [loadCompanyTags]);

	const getTextToPaste = tag => {
		if(tag.getValue){
			return tag.getValue();
		}

		let draftMode = false;
		if (tags) {
			if (tags[0].value.includes('{{')) {
				draftMode = true;
			}
		}

		if (draftMode) {
			return `{{${tag.key}}}`;
		}
		return tag.value;
	}


	return (
		<DropDownMenu
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			color={primary}
			requestClose={requestClose}
			open={open}
			loading={false}
			paperPropsStyles={{ border: " solid 1px #353434", borderRadius: '3px', }}
			styleBody={{}}
			Component={() => <span />}
			text={translate.add_agenda_point}
			textStyle={"ETIQUETA"}
			items={
				<div style={{}}
					onClick={event => {
						event.stopPropagation();
					}}
				>
					<div style={{
						margin: "0px 1em",
					}}>
						<div style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between"
						}}
						>
							<div>
								<TextInput
									placeholder={"Buscar Etiquetas"}
									adornment={<Icon>search</Icon>}
									id={"buscarEtiquetasEnModal"}
									type="text"
									stylesAdornment={{ color: primary }}
									value={searchModal}
									styleInInput={{ fontSize: "12px", color: primary }}
									styles={{ marginBottom: "0" }}
									onChange={event => {
										setSearchModal(event.target.value);
									}}
									disableUnderline={true}
								/>
							</div>
							<div style={{ color: primary }}>
								&lt;tags&gt;
							</div>
						</div>
					</div>
					<Divider style={{ background: primary }} />
					<div
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
							margin: "1em"
						}}
					>
						{/* //TRADUCCION */}
						<div style={{ fontSize: "14px", display: "flex", alignItems: "center", color: "#969696", minWidth: "700px", marginBottom: "0.5em" }} >
							<i className="material-icons" style={{ color: primary, fontSize: '14px', cursor: "pointer", paddingRight: "0.3em" }} onClick={() => setOcultar(false)}>
								help
										</i>
							{!ocultar &&
								<div>Los &lt;tags&gt; son marcas inteligentes que añaden el nombre o elemento personalizado al documento <u style={{ cursor: "pointer" }} onClick={() => setOcultar(true)}>(Ocultar)</u></div>
							}
						</div>
						<div style={{ width: "97%", height: "30vh" }} >
							<div style={{ width: "100%", height: '100%' }}>
								<Scrollbar>
									<div style={{ height: '100%' }}>
										<Table style={{ maxWidth: "100%", width: "100%" }}>
											<TableHead>
												<TableRow style={{ color: "black" }}>
													{/* TRADUCCION */}
													<TableCell style={{ color: "black", fontSize: "16px" }}>
														Clave
                                                     </TableCell>
													<TableCell style={{ color: "black", fontSize: "16px" }}>
														Valor
                                                    </TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{filteredTags.map((tag, index) => {
													return (
														<HoverableRow
															key={`tag_${tag.index}`}
															tag={tag}
															translate={translate}
															onClick={() => {
																paste(`<span id="${tag.id}">${getTextToPaste(tag)}</span>`)
																requestClose();
															}}
														/>
													);
												})}
												{/* {(!loading && companyTags) && companyTags.map(tag => {
													return (
														<HoverableRow
															key={`tag_${tag.id}`}
															tag={tag}
															translate={translate}
															onClick={() => {
																paste(`<span id="${tag.id}">${getTextToPaste(tag)}</span>`)
																requestClose();
															}}
														/>
													)
												})} */}
											</TableBody>
										</Table>
									</div>
								</Scrollbar>
							</div>
						</div>
					</div>
				</div>
			}
		/>
	)
}))


const HoverableRow = ({ tag, onClick }) => {
	const [show, handlers] = useHoverRow();
	const primary = getPrimary();

	return (
		<TableRow
			{...handlers}
			style={{
				background: show && "rgba(0, 0, 0, 0.07)",
				cursor:"pointer"
			}}
			onClick={onClick}
		>
			<TableCell style={{ color: "black" }}>
				{tag.key || tag.label}
			</TableCell>
			<TableCell style={{ color: primary }}>
				{tag.description || tag.value }
			</TableCell>
		</TableRow>
	)
}

export default RichTextInput;