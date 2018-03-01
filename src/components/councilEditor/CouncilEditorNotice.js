import React, { Component } from 'react';
import { FontIcon, MenuItem} from 'material-ui';
import { BasicButton, TextInput, SelectInput, DateTimePicker, RichTextInput, LoadingSection, ErrorAlert } from "../displayComponents";
import { getPrimary } from '../../styles/colors';
import PlaceModal from './PlaceModal';
import { graphql, compose } from 'react-apollo';
import { getCouncilDataStepOne, saveCouncilData } from '../../queries';
import { urlParser } from '../../utils';

class CouncilEditorNotice extends Component {

    constructor(props){
        super(props);
        this.state = {
            placeModal: false,
            alert: false,
            data: {},
            errors: {
                name : '',
                date_start : "",
                date_start_2nd_call : "",
                country : '',
                country_state : '',
                city : '',
                zipcode : '',
                convene_text : '',
                street : '',
            }
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    nextPage = () => {
        if(!this.checkRequiredFields()){
            this.saveCouncil();
            this.props.nextStep();
        }
    }

    checkRequiredFields() {

        const { translate } = this.props;

        let errors = {
            name : '',
            date_start : "",
            date_start_2nd_call : "",
            convene_text : '',
        };

        let hasError = false;

        if(!this.state.data.name){
            hasError = true;
            errors.name = translate.new_enter_title
        }

        if(!this.state.data.date_start){
            hasError = true;
            errors.date_start = 'Este campo es obligatorio'
        }

        if(!this.state.data.convene_text){
            hasError = true;
            errors.convene_text = 'Este campo es obligatorio'
        }
        


        this.setState({
            alert: true,
            errors: errors
        });
        
        return hasError;
    }

    saveCouncil = () => {
        this.props.saveCouncil({
            variables: {
                data: urlParser({
                    data: {
                        council: {
                            ...this.state.data,
                            step: this.props.actualStep > 1? this.props.actualStep : 1
                        }
                    }
                })
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

    componentWillReceiveProps(nextProps){
       if(this.props.data.loading && !nextProps.data.loading){
            this.setState({
                data: nextProps.data.council.council
            })
        }
    }

    render(){
        const { translate } = this.props;

        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <h4>{translate.date_time_place}</h4>
                <h5>{`${translate.new_location_of_celebrate}: `}{
                    this.state.data.remote_celebration === 1 ? 
                        translate.remote_celebration 
                    : 
                        `${this.state.data.street}, ${this.state.data.country}` }</h5>
                <BasicButton
                    text={translate.change_location}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={() => this.setState({placeModal: true})}
                    icon={<FontIcon className="material-icons">location_on</FontIcon>}
                />
                <BasicButton
                    text={translate.save}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    textPosition="after"
                    onClick={this.saveCouncil} 
                />
                <BasicButton
                    text={translate.next}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.nextPage}
                />
                <PlaceModal
                    open={this.state.placeModal}
                    close={() => this.setState({placeModal: false})}
                    place={this.state.place}
                    translate={this.props.translate}
                    saveAndClose={this.savePlaceAndClose}
                    council={this.state.data}
                />
                <br/>
                <SelectInput
                    floatingText={translate.council_type}
                    value={this.state.data.council_type || ''}
                    onChange={(event, index) => {
                        console.log(event.nativeEvent)
                        this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council_type: index
                            }
                        })}
                    }
                >   
                    <MenuItem value={0} primaryText={translate.ordinary_general_assembly} />
                    <MenuItem value={1} primaryText={translate.special_general_assembly} />
                    <MenuItem value={2} primaryText={translate.board_of_directors} />
                </SelectInput>
                <DateTimePicker 
                    onChange={(date) => {
                        const newDate = new Date(date);
                        this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                date_start: newDate.toISOString()
                            }
                        })}
                    }
                    floatingText = {translate["1st_call_date"]}
                    format='DD/MM/YYYY hh:mm'
                    value={this.state.data.date_start}
                />
                <TextInput
                    floatingText={translate.convene_header}
                    type="text"
                    errorText={this.state.errors.name}
                    value={this.state.data.name || ''}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            name: event.nativeEvent.target.value
                        }
                    })}
                /><br />
                <RichTextInput
                    errorText=''
                    floatingText={translate.convene_info}
                    value={this.state.data.convene_text || ''}
                    onChange={(value) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            convene_text: value
                        }
                    })}
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
    graphql(getCouncilDataStepOne, {
        name: "data",
        options: (props) => ({
            variables: {
                councilInfo: {
                    companyID: props.companyID,
                    councilID: props.councilID,
                    step: 1
                }
            }
        })
    }),

    graphql(saveCouncilData, {
        name: "saveCouncil"
    })
)(CouncilEditorNotice);
 