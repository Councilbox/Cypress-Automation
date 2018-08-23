import React from "react";
import { Button } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import CollapsibleSection from '../../../displayComponents/CollapsibleSection';
import { getPrimary, getSecondary } from "../../../styles/colors";

const styles = {
	container: {
		width: "100%",
		height: "100%",
        overflow: 'hidden'
	},
    agendasHeader:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
};

class Votes extends React.Component {
    state = {
        selected: 0
    }

	render() {
		const { translate, council, agendasAnchor, toggleAgendasAnchor } = this.props;
        const { selected } = this.state;

		return (
            <div>
            
            </div>
		);
	}
}


export default withTranslations()(Votes);
