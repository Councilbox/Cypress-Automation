import React from 'react';
import { AlertConfirm, BasicButton, LoadingSection } from '../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { Paper } from 'material-ui';
import { councils } from '../../../queries';
import { COUNCIL_STATES } from '../../../constants';
import { ConfigContext } from '../../../containers/AppControl';
import CouncilDetails from '../display/CouncilDetails'

class LoadFromPreviousCouncil extends React.Component {

    state = {
        modal: false,
        council: null
    }

    closeModal = () => {
        this.setState({
            modal: false
        });
    }

    showCouncilDetails = council => {
        this.setState({
            council
        });
    }

    closeCouncilDetails = () => {
        this.setState({
            council: null
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

        if(this.state.council){
            return <CouncilDetails council={this.state.council} translate={this.props.translate} />;
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
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                        onClick={this.loadFromCouncil(council)}
                    >
                        <div className="truncate" style={{width: '70%'}}>
                            {council.name}
                        </div>
                        <BasicButton
                            text="Ver detalles"//TRADUCCION
                            type="flat"
                            textStyle={{color: getSecondary(), fontWeight: '700'}}
                            onClick={event => {
                                event.stopPropagation();
                                this.showCouncilDetails(council)
                            }}
                        />
                    </Paper>
                ))}
            </div>
        )
    }

    render() {
        const { translate } = this.props;

        return (
            <ConfigContext.Consumer>
                {value => (
                    value.cloneCouncil ?
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
                                requestClose={!!this.state.council? this.closeCouncilDetails : this.closeModal}
                                open={this.state.modal}
                                hideAccept={!!this.state.council}
                                acceptAction={this.changeCensus}
                                buttonAccept={translate.accept}
                                buttonCancel={!!this.state.council? translate.back : translate.cancel}
                                bodyText={this._renderBody()}
                                title={'Cargar una reunión pasada'}
                            />
                        </React.Fragment>
                    :
                        <span />
                )}
            </ConfigContext.Consumer>
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