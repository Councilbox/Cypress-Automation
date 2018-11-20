import React from 'react';
import { AlertConfirm, BasicButton, LoadingSection } from '../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary } from '../../../styles/colors';
import { Paper } from 'material-ui';
import { councils } from '../../../queries';
import { COUNCIL_STATES } from '../../../constants';

class LoadFromPreviousCouncil extends React.Component {

    state = {
        modal: false
    }

    closeModal = () => {
        this.setState({
            modal: false
        });
    }

    loadFromCouncil = council => async () => {
        const response = await this.props.loadFromPreviousCouncil({
            variables: {
                councilId: this.props.council.id,
                originId: council.id
            }
        });

        this.props.refetch();
        this.closeModal();

    }

    showModal = () => {
        this.setState({
            modal: true
        });
    }

    _renderBody = () => {

        if(!this.props.data.loading && this.props.data.councils.length === 0){
            //TRADUCCION
            return <span>No tiene ninguna reunión celebrada</span>
        }

        if(!this.props.data.councils){
            return <LoadingSection />;
        }

        return (
            <div>
                {this.props.data.councils.map(council => (
                    <Paper
                        key={`loadFromCouncil_${council.id}`}
                        style={{
                            width: '100%',
                            marginBottom: '0.6em',
                            padding: '0.6em',
                            cursor: 'pointer'
                        }}
                        onClick={this.loadFromCouncil(council)}
                    >
                        {council.name}
                    </Paper>
                ))}
            </div>
        )
    }

    render() {
        const { translate } = this.props;

        return (
            <React.Fragment>
                <BasicButton
                    text={'Clonar una reunión existente'}//TRADUCCION
                    color={getSecondary()}
                    textStyle={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: "0.9em",
                        textTransform: "none"
                    }}
                    buttonStyle={{
                        marginBottom: '0.6em'
                    }}
                    textPosition="after"
                    onClick={this.showModal}
                    icon={
                        <i className="fa fa-clone" aria-hidden="true" style={{marginLeft: '0.3em'}}></i>
                    }
                />
                <AlertConfirm
                    requestClose={this.closeModal}
                    open={this.state.modal}
                    acceptAction={this.changeCensus}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderBody()}
                    title={'Cargar una reunión pasada'}
                />
            </React.Fragment>
        )
    }
}

const loadFromPreviousCouncil = gql`
    mutation LoadFromPreviousCouncil($councilId: Int!, $originId: Int!){
        loadFromAnotherCouncil(councilId: $councilId, originId: $originId){
            success
            message
        }
    }
`;

export default compose(
    graphql(loadFromPreviousCouncil, { name: 'loadFromPreviousCouncil' }),
    graphql(councils, {
        options: props => ({
            variables: {
                state: Object.values(COUNCIL_STATES).filter(filterCouncilStates),
                companyId: props.company.id,
                isMeeting: false,
                active: 1
            },
            errorPolicy: 'all'
        })
    })
)(LoadFromPreviousCouncil);

const filterCouncilStates = state => (
    state !== COUNCIL_STATES.CANCELED &&
    state !== COUNCIL_STATES.DRAFT &&
    state !== COUNCIL_STATES.PRECONVENE &&
    state !== COUNCIL_STATES.PREPARING &&
    state !== COUNCIL_STATES.SAVED
);