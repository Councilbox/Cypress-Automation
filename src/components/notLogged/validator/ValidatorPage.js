import React from 'react';
import { NotLoggedLayout, TextInput, BasicButton, SectionTitle, LoadingSection } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { Card } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { getPrimary } from '../../../styles/colors';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

//3f055426-0770-419c-a609-e42efe1a4fe1

class ValidatorPage extends React.Component {

    state = {
        code: this.props.match.params.uuid,
        error: '',
        data: ''
    }

    async componentDidMount(){
        if(this.props.match.params.uuid){
            await this.searchCode(this.props.match.params.uuid)
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.match.params.uuid){
            if(this.props.match.params.uuid !== prevState.code){
                this.searchCode(this.props.match.params.uuid);
            }
        }

    }

    componentWillUnmount(){
        console.log('se desmonta');
    }

    updateCode = event => {
        this.setState({
            code: event.target.value
        });
    }

    sendCode = () => {
        this.props.history.push(`/validator/${this.state.code}`);
    }

    handleEnter = event => {
        const key = event.nativeEvent;

        if(key.keyCode === 13){
            if(this.state.code !== this.props.match.params.uuid){
                this.sendCode();
            }
        }
    }

    searchCode = async code => {
        this.setState({
            loading: true
        });
        const response = await this.props.client.query({
			query: getData,
			variables: {
				code: code
			}
        });

        if(response.errors){
            if(response.errors[0].code === 404){
                return this.setState({
                    error: 'Evidencia no encontrada', //TRADUCCION
                    loading: false,
                    data: null
                });
            }
            if(response.errors[0].code === 401){
                return this.setState({
                    error: 'No tienes acceso a esta información',
                    loading: false,
                    data: null
                });
            }
        }

        this.setState({
            loading: false,
            error: '',
            data: response.data.evidenceContent
        })
    }

    render(){
        //TRADUCCION
        const primary = getPrimary();
        console.log(this.state);
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
                            onKeyUp={this.handleEnter}
                        />
                        <BasicButton
                            text={'Enviar'}
                            onClick={this.sendCode}
                            color={primary}
                            textStyle={{ color: 'white', fontWeight: '700'}}
                        />
                        {this.state.loading &&
                            <LoadingSection />
                        }
                        {this.state.error &&
                            <div style={{fontWeight: '700', color: 'red', marginTop: '1em', fonSize: '1.1em'}}>
                                {this.state.error}
                            </div>
                        }
                        {this.state.data &&
                            <div style={{fontWeight: '700', color: 'green', marginTop: '1em', fonSize: '1.1em', wordWrap: 'break-word'}}>
                                {this.state.data.content}
                            </div>
                        }
                    </Card>
                </div>
			</NotLoggedLayout>
        )
    }
}

const getData = gql`
    query EvidenceContent($code: String!){
        evidenceContent(code: $code){
            userId
            participantId
            content
            type
        }
    }
`;

export default withApollo(withTranslations()(ValidatorPage));
