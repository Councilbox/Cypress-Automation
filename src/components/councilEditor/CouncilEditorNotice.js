import React, { Component } from 'react';
import { MenuItem} from 'material-ui';
import { BasicButton, TextInput, SelectInput, DateTimePicker, RichTextInput, LoadingSection, ErrorAlert, ButtonIcon } from "../displayComponents";
import { getPrimary } from '../../styles/colors';
import PlaceModal from './PlaceModal';
import { graphql, compose } from 'react-apollo';
import { councilStepOne, updateCouncil, changeStatute } from '../../queries';

class CouncilEditorNotice extends Component {

    constructor(props){
        super(props);
        this.state = {
            placeModal: false,
            alert: false,
            data: {},
            errors: {
                name : '',
                dateStart : "",
                dateStart2NdCall : "",
                country : '',
                countryState : '',
                city : '',
                zipcode : '',
                conveneText : '',
                street : '',
            }
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    componentWillReceiveProps(nextProps){
        if(this.props.data.loading && !nextProps.data.loading){
             this.setState({
                 data: nextProps.data.council
             })
         }
     }

    nextPage = () => {
        if(!this.checkRequiredFields()){
            this.updateCouncil();
            this.props.nextStep();
        }
    }

    checkRequiredFields() {

        const { translate } = this.props;

        let errors = {
            name : '',
            dateStart : "",
            dateStart2NdCall : "",
            conveneText : '',
        };

        let hasError = false;

        if(!this.state.data.name){
            hasError = true;
            errors.name = translate.new_enter_title
        }

        if(!this.state.data.dateStart){
            hasError = true;
            errors.dateStart = 'Este campo es obligatorio'
        }

        if(!this.state.data.conveneText){
            hasError = true;
            errors.conveneText = 'Este campo es obligatorio'
        }
        


        this.setState({
            alert: true,
            errors: errors
        });
        
        return hasError;
    }

    updateCouncil = () => {
        const { __typename, ...council } = this.state.data;
        console.log(council);
        this.props.updateCouncil({
            variables: {
                council: {
                    ...council,
                    step: this.props.actualStep > 1? this.props.actualStep : 1
                }
            }
        });
    }

    savePlaceAndClose = (council) => {
        this.setState({
            placeModal: false,
            data: {
                ...this.state.data,
                ...council
            }
        })
    }

    updateState = (object) =>  {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    changeStatute = async (statuteId) => {
        const response = await this.props.changeStatute({
            variables: {
                councilId: this.props.councilID,
                statuteId: statuteId
            }
        });

        if(response){
            this.props.data.refetch();
        }
    }

    render(){
        const { translate } = this.props;
        const { loading, companyStatutes } = this.props.data;
        const council = this.state.data;

        if(loading){
            return(
                <div style={{height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <LoadingSection />
                </div>
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <div className="row" >
                    <div className="col-lg-12 col-md-12 col-xs-12" style={{height: '4em', verticalAlign: 'middle', display: 'flex', alignItems: 'center'}}>
                        <BasicButton
                            text={translate.change_location}
                            color={getPrimary()}
                            textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                            textPosition="after"
                            onClick={() => this.setState({placeModal: true})}
                            icon={<ButtonIcon type="location_on" color="white" />}
                        />
                        <h6 style={{marginLeft: '1.5em'}}><b>{`${translate.new_location_of_celebrate}: `}</b>{
                            this.state.data.remoteCelebration === 1 ? 
                                translate.remote_celebration 
                            : 
                                `${council.street}, ${council.country}` }
                        </h6>
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <SelectInput
                            floatingText={translate.council_type}
                            value={this.props.data.council.statute.statuteId || ''}
                            onChange={(event) => this.changeStatute(+event.target.value)}
                        >   
                            {companyStatutes.map((statute) => {
                                return <MenuItem value={+statute.id} key={`statutes_${statute.id}`}>{translate[statute.title] || statute.title}</MenuItem>
                            })}
                        </SelectInput>
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">                    
                        <DateTimePicker 
                            onChange={(date) => {
                                const newDate = new Date(date);
                                this.updateState({
                                    dateStart: newDate.toISOString()
                                })}
                            }
                            label = {translate["1st_call_date"]}
                            value={council.dateStart}
                        />
                    </div>
                    <div className="col-lg-5 col-md-6 col-xs-12" style={{margin: '0.7em 0.7em 0 0'}}>
                        <TextInput
                            floatingText={translate.convene_header}
                            type="text"
                            errorText={this.state.errors.name}
                            value={council.name || ''}
                            onChange={(event) => this.updateState({
                                name: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-10 col-md-10 col-xs-12" style={{margin: '0.7em 0.7em 0 0'}}>
                        <RichTextInput
                            errorText=''
                            floatingText={translate.convene_info}
                            value={council.conveneText || ''}
                            onChange={(value) => this.updateState({
                                conveneText: value
                            })}
                        />
                    </div>
                </div>

                <div style={{marginTop: '2em', width: '40%', float: 'right', height: '3em'}}>
                    <BasicButton
                        text={translate.save}
                        color={getPrimary()}
                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none', marginRight: '0.6em'}}
                        icon={<ButtonIcon type="save" color="white" />}
                        textPosition="after"
                        onClick={this.updateCouncil} 
                    />
                    <BasicButton
                        text={translate.next}
                        color={getPrimary()}
                        icon={<ButtonIcon type="arrow_forward" color="white" />}                        
                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                        textPosition="after"
                        onClick={this.nextPage}
                    />
                </div>

                <PlaceModal
                    open={this.state.placeModal}
                    close={() => this.setState({placeModal: false})}
                    place={this.state.place}
                    countries={this.props.data.countries}
                    translate={this.props.translate}
                    saveAndClose={this.savePlaceAndClose}
                    council={this.state.data}
                />  
                <ErrorAlert
                    title={translate.error}
                    bodyText={translate.check_form}
                    buttonAccept={translate.accept}
                    open={this.state.alert}
                    requestClose={() => this.setState({alert: false})}
                />
            </div>
        );
    }
}

export default compose(
    graphql(councilStepOne, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID,
                companyId: props.companyID
            }
        })
    }),

    graphql(changeStatute, {
        name: 'changeStatute'
    }),

    graphql(updateCouncil, {
        name: "updateCouncil"
    })
)(CouncilEditorNotice);