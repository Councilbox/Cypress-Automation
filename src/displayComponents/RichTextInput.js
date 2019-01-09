import React from "react";
import { Grid, GridItem } from "./index";
import { Typography, MenuItem } from "material-ui";
import { getSecondary } from "../styles/colors";
import FontAwesome from 'react-fontawesome';
import { removeHTMLTags } from '../utils/CBX';
// import RichTextEditor from 'react-rte';
import { isMobile } from 'react-device-detect';
import { TextArea } from 'antd/lib/input/index';
import DropDownMenu from './DropDownMenu';
import Icon from './Icon';
import withTranslations from '../HOCs/withTranslations';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'quill';

class RichTextInput extends React.Component {
	state = {
		value: (
			this.props.value
		)
	};

	componentDidMount() {
		this.setState({
			value: (
				this.props.value
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
			if (removeHTMLTags(html).length > 0) {
				console.log(html)
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
			value: (value
			)
		});
	};

	paste = text => {
		const quill = this.rtEditor.getEditor();
		const selection = quill.getSelection();
		if (selection !== null) {
			quill.clipboard.dangerouslyPasteHTML(selection.index, text);
			setTimeout(this.rtEditor.focus, 500);
		}
	};



	render() {
		const { tags, loadDraft, errorText, required, translate } = this.props;
		const secondary = getSecondary();
		const modules = {
			toolbar: {
				container: [
					[{ 'color': [] }, { 'background': [] }], , [ 'bold', /*'font', */'italic', 'underline', 'italic', 'link', /*'size',*/ 'strike'/*, 'script'*/],
					['blockquote', /*'header', 'indent', 'list',*/ 'align', 'direction', 'code-block', { 'list': 'ordered' }, { 'list': 'bullet' }],
					[{ 'header': 1 }, { 'header': 2 }],
					
					// [{ 'size': [ false, 'large', 'huge'] }],
					['image', 'video'],
				],
				handlers: {
					// 'image': this.imageHandler,

				}
			},
			clipboard: {
				matchVisual: false,
			}
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
											float: "right",
										}}
									>
										<div style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-end'
										}}>
											<DropDownMenu
												color="transparent"
												text={'Etiquetas inteligentes'}
												textStyle={{ color: secondary, paddingTop: '0px' }}
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
											<div>
												{!!loadDraft && loadDraft}
											</div>
											{!!this.props.saveDraft &&
												this.props.saveDraft
											}
										</div>
									</div>
								</React.Fragment>
							)}
						</div>
						{
							<ReactQuill value={this.state.value}
								onChange={this.onChange}
								modules={modules}
								ref={editor => this.rtEditor = editor}
								id={this.props.id}
								className={`text-editor ${!!errorText ? 'text-editor-error' : ''}`}
							/>
						}
					</GridItem>
				</Grid>
			</React.Fragment>
		);
	}
}

export default RichTextInput;