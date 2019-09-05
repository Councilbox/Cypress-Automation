import React from "react";
import { Grid, GridItem } from "./index";
import { Typography, MenuItem } from "material-ui";
import { getSecondary } from "../styles/colors";
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

if (isChrome) {
	let style = document.createElement("style");
	style.innerHTML = '.ql-editor{white-space: normal !important;}';
	document.head.appendChild(style);
}


var AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);

class RichTextInput extends React.Component {
	state = {
		value: this.props.value
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
		if(!this.rtEditor){
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
		const { tags, loadDraft, errorText, required, translate } = this.props;
		const modules = {
			toolbar: {
				container: [
					[{ 'color': [] }, { 'background': [] }], [ 'bold', 'italic', 'underline', 'link', 'strike'],
					['blockquote', 'code-block', { 'list': 'ordered' }, { 'list': 'bullet' }],
					[{ 'header': 1 }, { 'header': 2 }],
					[{ 'align': 'justify'}]
				],
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
													translate={translate}
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


const SmartTags = withApollo(withSharedProps()(({ company, translate, tags, paste, client }) => {
	const secondary = getSecondary();
	const [companyTags, setCompanyTags] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const loadCompanyTags = React.useCallback(async () => {
		const response = await client.query({
			query,
			variables: {
				companyId: company.id
			}
		});
		setLoading(false);
		setCompanyTags(response.data.companyTags);
	}, [company.id]);

	React.useEffect(() => {
		loadCompanyTags();
	}, [loadCompanyTags]);

	const getTextToPaste = tag => {
		let draftMode = false;
		if(tags){
			if(tags[0].value.includes('{{')){
				draftMode = true;
			}
		}

		if(draftMode) {
			return `{{${tag.key}}}`;
		}

		return tag.value;
	}


	return (
		<DropDownMenu
			color="transparent"
			text={translate.markers}
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
									paste(`<span id="${tag.label}">${tag.getValue? tag.getValue() : tag.value}</span>`)
								}

							>
								{tag.label}
							</MenuItem>
						);
					})}
					{(!loading && companyTags) && companyTags.map(tag => (
						<MenuItem
								key={`tag_${tag.id}`}
								onClick={() =>
									paste(`<span id="${tag.id}">${getTextToPaste(tag)}</span>`)
								}

							>
								{tag.key}
						</MenuItem>
					))}
				</React.Fragment>
			}
		/>
	)
}))

export default RichTextInput;