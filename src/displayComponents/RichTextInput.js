import React from "react";
import { Grid, GridItem } from "./index";
import { Typography } from "material-ui";
import { getSecondary } from "../styles/colors";
import FontAwesome from 'react-fontawesome';
import { removeHTMLTags } from '../utils/CBX';
import RichTextEditor from 'react-rte';
//import { Editor } from 'slate-react';
//import { Value } from 'slate';
//import Html from 'slate-html-serializer';

/* const BLOCK_TAGS = {
	blockquote: 'quote',
	p: 'paragraph',
	pre: 'code',
}

const MARK_TAGS = {
	em: 'italic',
	strong: 'bold',
	u: 'underline',
}

const rules = [
	{
		deserialize(el, next) {
			const type = BLOCK_TAGS[el.tagName.toLowerCase()]
			if (type) {
				return {
					object: 'block',
					type: type,
					data: {
						className: el.getAttribute('class'),
					},
					nodes: next(el.childNodes),
				}
			}
		},
		serialize(obj, children) {
			if (obj.object == 'block') {
				switch (obj.type) {
					case 'code':
						return (
							<pre>
								<code>{children}</code>
							</pre>
						)
						case 'paragraph':
							return <p className={obj.data.get('className')}>{children}</p>
						case 'quote':
							return <blockquote>{children}</blockquote>
					}
				}
			},
		},
	// Add a new rule that handles marks...
		{
		deserialize(el, next) {
			const type = MARK_TAGS[el.tagName.toLowerCase()]
			if (type) {
				return {
					object: 'mark',
					type: type,
					nodes: next(el.childNodes),
				}
			}
		},
		serialize(obj, children) {
			if (obj.object == 'mark') {
					switch (obj.type) {
						case 'bold':
							return <strong>{children}</strong>
						case 'strong':
							return <strong>{children}</strong>
						case 'italic':
							return <em>{children}</em>
						case 'underline':
							return <u>{children}</u>
					}
				}
			},
		},
]

const html = new Html({ rules });

class RichTextInput extends React.Component {
	state = {
		value: html.deserialize(this.props.value)
	}

	onChange = ({ value }) => {
		this.setState({ value })
		console.log(value);
		console.log(html.serialize(value));
	}

	render() {
		return(
			<Editor
				value={this.state.value}
				onChange={this.onChange}
				style={{
					border: '1px solid gainsboro',
					minHeight: '6em',
					fontFamily: 'Lato'
				}}

				renderMark={renderMark}
			/>
		);
	}
}

const renderMark = props => {
    switch (props.mark.type) {
      case 'bold':
        return <strong>{props.children}</strong>
      // Add our new mark renderers...
      case 'code':
        return <code>{props.children}</code>
      case 'italic':
        return <em>{props.children}</em>
      case 'strikethrough':
        return <del>{props.children}</del>
      case 'underline':
        return <u>{props.children}</u>
    }
}
 */
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
		console.log(this.rtEditor);
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
		cd.setData("text/plain", text);
		this.rtEditor.refs.editor._onPaste({
			preventDefault: () => {
				this.rtEditor.refs.editor.focus();
			},
			clipboardData: cd
		});
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
							ref={editor => this.rtEditor = editor}
							id={this.props.id}
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

export default RichTextInput;
