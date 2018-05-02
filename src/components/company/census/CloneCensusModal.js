import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { AlertConfirm, SelectInput, TextInput, RichTextInput } from '../../../displayComponents';
import { MenuItem } from 'material-ui';
import { cloneCensus } from '../../../queries';


class CloneCensusModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                censusName: '',
                quorumPrototype: 0,
                censusDescription: ''
            },

            modal: false,

            errors: {
                censusName: '',
                quorumPrototype: '',
                censusDescription: ''
            }
        }
    }

    componentDidMount(){
        this.setState({
            data: {
                ...this.props.census,
                censusDescription: this.props.census.censusDescription || ''
            }
        });
    }

    componentWillReceiveProps(nextProps){
        const actualCensus = this.props.census;
        const nextCensus = nextProps.census;

        if(actualCensus.id !== nextCensus.id){
            this.setState({
                data: {
                    ...nextCensus,
                    censusDescription: nextCensus.censusDescription || ''
                    
                }
            });
        }
    }
    
    cloneCensus = async () => {
        if(this.checkRequiredFields()){
            const { __typename, ...census} = this.state.data;
            const response = await this.props.cloneCensus({
                variables: {
                    census: {
                        ...census
                    }
                }
            });
            if(response){
                console.log(response);
                this.props.refetch();
                this.setState({
                    modal: false,
                });
            }
        }
    };

    updateState(object){
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        })
    }

    checkRequiredFields(){
        return true;
    }

    _renderNewPointBody = () => {
        const { translate } = this.props;
        const errors = this.state.errors;
        const census = this.state.data;
        
        return(
            <Fragment>
                <div className="row"> 
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.name}
                            required
                            type="text"
                            errorText={errors.censusName}
                            value={census.censusName}
                            onChange={(event) => {
                                this.updateState({
                                    censusName: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <SelectInput
                            floatingText={translate.census_type}
                            value={census.quorumPrototype}
                            onChange={(event) => {
                                this.updateState({
                                    quorumPrototype: event.target.value
                                }) 
                            }}
                        >
                            <MenuItem value={0}>{translate.census_type_assistants}</MenuItem>
                            <MenuItem value={1}>{translate.social_capital}</MenuItem>    
                        </SelectInput>
                    </div>
                </div>

                <RichTextInput
                    floatingText={translate.description}
                    type="text"
                    errorText={errors.censusDescription}
                    value={census.censusDescription}
                    onChange={(value) => {                     
                        this.updateState({
                            censusDescription: value
                        })
                    }}
                />
            </Fragment>
        );
    };

    render(){
        const { translate, children } = this.props;
 
        return(
            <Fragment>
                <span onClick={() => this.setState({modal: true})}>
                    {children}
                </span>
                <AlertConfirm
                    requestClose={() => this.setState({modal: false})}
                    open={this.state.modal}
                    acceptAction={this.cloneCensus}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderNewPointBody()}
                    title={translate.clone_census}
                />
            </Fragment>
        );
    }
}

export default graphql(cloneCensus, {
    name: 'cloneCensus' 
})(CloneCensusModal);
