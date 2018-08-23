import React from "react";
import { Grid, GridItem } from "./index";
import { Typography } from "material-ui";
import { getSecondary } from "../styles/colors";
import FontAwesome from 'react-fontawesome';
import { removeHTMLTags } from '../utils/CBX';
import RichTextEditor from 'react-rte';

/* const RichTextEditor = Loadable({
	loader: () => import('react-rte'),
	loading: LoadingSection
}) */

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
		if (this.props.onChange) {
			if(removeHTMLTags(value.toString("html")).length > 0){
				this.props.onChange(
					value.toString("html").replace(/<a /g, '<a target="_blank" ')
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
		cd.setData("text/plain", text);
		this.refs.rtEditor.refs.editor._onPaste({
			preventDefault: () => {
				this.refs.rtEditor.refs.editor.focus();
			},
			clipboardData: cd
		});
	};

	render() {
		const { tags, loadDraft, errorText, required } = this.props;
		const secondary = getSecondary();

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
										{tags.map(tag => {
											return (
												<div
													key={`tag_${tag.label}`}
													onClick={() =>
														this.paste(tag.value)
													}
													style={{
														padding: "0.1em 0.25em",
														border: `1px solid ${secondary}`,
														cursor: "pointer",
														marginLeft: "0.2em",
														borderRadius: "2px",
														color: secondary
													}}
												>
													{tag.label}
												</div>
											);
										})}
										{!!loadDraft && loadDraft}
									</div>
								</React.Fragment>
							)}
						</div>
						<RichTextEditor
							ref={"rtEditor"}
							className={`text-editor ${!!errorText? 'text-editor-error' : ''}`}
							value={this.state.value}
							onChange={this.onChange}
							toolbarConfig={toolbarConfig}
						/>
					</GridItem>
				</Grid>
			</React.Fragment>
		);
	}
}

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
			label: "Bold",
			style: "BOLD",
			className: "custom-css-class"
		},
		{
			label: "Italic",
			style: "ITALIC"
		},
		{
			label: "Underline",
			style: "UNDERLINE"
		}
	],
	BLOCK_TYPE_DROPDOWN: [
		{
			label: "Normal",
			style: "unstyled"
		},
		{
			label: "Heading Large",
			style: "header-one"
		},
		{
			label: "Heading Medium",
			style: "header-two"
		},
		{
			label: "Heading Small",
			style: "header-three"
		}
	],
	BLOCK_TYPE_BUTTONS: [
		{
			label: "UL",
			style: "unordered-list-item"
		},
		{
			label: "OL",
			style: "ordered-list-item"
		}
	]
};

export default RichTextInput;
