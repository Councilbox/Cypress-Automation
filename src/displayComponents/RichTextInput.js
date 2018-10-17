import React from "react";
import { Grid, GridItem } from "./index";
import { Typography, MenuItem } from "material-ui";
import { getSecondary } from "../styles/colors";
import FontAwesome from 'react-fontawesome';
import { removeHTMLTags } from '../utils/CBX';
import RichTextEditor from 'react-rte';
import { isMobile } from 'react-device-detect';
import { TextArea } from 'antd/lib/input/index';
import DropDownMenu from './DropDownMenu';
import Icon from './Icon';

class RichTextInput extends React.Component {
	state = {
		value: RichTextEditor.createValueFromString(
			this.props.value,
			"html"
		)
	};

	componentDidMount() {
		this.setState({
			value: RichTextEditor.createValueFromString(
				this.props.value,
				"html"
			)
		});
	}

	changeShowTags = () => {
		this.setState({
			showTags: !this.state.showTags
		});
	};

	onChange = value => {
		this.setState({ value });
		const html = value.toString('html');
		if (this.props.onChange) {
			if(removeHTMLTags(html).length > 0){
				this.props.onChange(
					html.replace(/<a /g, '<a target="_blank" ')
				);
			}else{
				this.props.onChange('');
			}
		}
	};

	setValue = value => {
		this.setState({
			value: RichTextEditor.createValueFromString(value, "html")
		});
	};

	paste = text => {
		let cd = new DataTransfer();
		cd.setData("text/html", text);
		this.rtEditor.refs.editor._onPaste({
			preventDefault: () => {
				this.rtEditor.refs.editor.focus();
			},
			clipboardData: cd
		});

		setTimeout(() => this.rtEditor.refs.editor.focus(), 500);
	};

	render() {
		const { tags, loadDraft, errorText, required } = this.props;
		const secondary = getSecondary();
		const toolbarConfig = {
			// Optionally specify the groups to display (displayed in the order listed).
			display: [
				"INLINE_STYLE_BUTTONS",
				"BLOCK_TYPE_BUTTONS",
				"LINK_BUTTONS",
				"TAGS",
				"BLOCK_TYPE_DROPDOWN",
				"HISTORY_BUTTONS"
			],
			INLINE_STYLE_BUTTONS: [
				{
					label: "Negrita", //TRADUCCION
					style: "BOLD",
					className: "custom-css-class"
				},
				{
					label: "Cursiva", //TRADUCCION
					style: "ITALIC"
				},
				{
					label: "Subrayado", //TRADUCCION
					style: "UNDERLINE"
				}
			],
			BLOCK_TYPE_DROPDOWN: [
				{
					label: "Normal", //TRADUCCION
					style: "unstyled"
				},
				{
					label: "Cabecera grande", //TRADUCCION
					style: "header-one"
				},
				{
					label: "Cabecera mediana", //TRADUCCION
					style: "header-two"
				},
				{
					label: "Cabecera pequeña", //TRADUCCION
					style: "header-three"
				}
			],
			BLOCK_TYPE_BUTTONS: [
				{
					label: "Lista desordenada", //TRADUCCION
					style: "unordered-list-item"
				},
				{
					label: "Lista ordenada", //TRADUCCION
					style: "ordered-list-item"
				}
			]
		};

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
							{!!tags && (
								<React.Fragment>
									<div
										style={{
											display: "flex",
											float: "right"
										}}
									>
										<DropDownMenu
											color="transparent"
											text={'Etiquetas inteligentes'}
											textStyle={{ color: secondary }}
											type="flat"
											icon={
												<Icon className="material-icons" style={{ color: secondary }}>
													keyboard_arrow_down
												</Icon>
											}
											items={
												<React.Fragment>
													{tags.map(tag => {
														return (
															<MenuItem
																key={`tag_${tag.label}`}
																onClick={() =>
																	this.paste(`<span id="${tag.label}">${tag.value}</span>`)
																}
															>
																{tag.label}
															</MenuItem>
														);
													})}

												</React.Fragment>
											}
										/>
										{!!loadDraft && loadDraft}
									</div>
								</React.Fragment>
							)}
						</div>
						{isMobile?
							<TextArea
								autosize={{ minRows: 3 }}
								value={this.props.value}
								onChange={event => this.props.onChange(event.target.value)}
							/>
						:
							<RichTextEditor
								ref={editor => this.rtEditor = editor}
								id={this.props.id}
								className={`text-editor ${!!errorText? 'text-editor-error' : ''}`}
								value={this.state.value}
								onChange={this.onChange}
								toolbarConfig={toolbarConfig}
							/>
						}
					</GridItem>
				</Grid>
			</React.Fragment>
		);
	}
}

export default RichTextInput;