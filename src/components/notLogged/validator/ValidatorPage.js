import React from 'react';
import { NotLoggedLayout, TextInput, BasicButton, SectionTitle } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { Card } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { getPrimary } from '../../../styles/colors';


class ValidatorPage extends React.Component {

    state = {
        code: ''
    }

    updateCode = event => {
        this.setState({
            code: event.target.value
        });
    }

    sendCode = async () => {
        console.log(this.state.code);
    }

    render(){
        //TRADUCCION
        const primary = getPrimary();

        return(
            <NotLoggedLayout
				translate={this.props.translate}
				languageSelector={true}
			>
                <div style={{width: '100%', overflow: 'auto'}}>
                    <Card style={{width: isMobile? '100%' : '70%', margin: '4em auto', padding: '1em', display: 'block'}}>
                        <SectionTitle
                            text="Introduce el código a comprobar"
                            color={primary}
                        />
                        <TextInput
                            floatingText="Código"
                            value={this.state.code}
                            onChange={this.updateCode}
                        />
                        <BasicButton
                            text={this.props.translate.send}
                            onClick={this.sendCode}
                            color={primary}
                            textStyle={{ color: 'white', fontWeight: '700'}}
                        />
                    </Card>
                </div>
			</NotLoggedLayout>
        )
    }
}

export default withTranslations()(ValidatorPage);
