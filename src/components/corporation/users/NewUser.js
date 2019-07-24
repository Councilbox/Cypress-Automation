import React from 'react';
import { CardPageLayout, ButtonIcon, BasicButton, LoadingSection } from '../../../displayComponents';
import { languages } from '../../../queries/masters';
import { graphql, compose } from 'react-apollo';
import UserForm from '../../userSettings/UserForm';
import { getPrimary } from '../../../styles/colors';
import CompanyLinksManager from './CompanyLinksManager';
import gql from 'graphql-tag';
import { bHistory } from '../../../containers/App';
import { checkValidEmail } from '../../../utils/validation';
import { useOldState } from '../../../hooks';

const NewUser = ({ fixedCompany, translate, ...props }) => {
    const [state, setState] = useOldState({
        data: {
            email: '',
            surname: '',
            name: '',
            preferredLanguage: 'es'
        },
        companies: fixedCompany? [fixedCompany] : [],
        errors: {}
    });
    const [success, setSuccess] = React.useState(false);

    const updateState = object => {
        setState({
            data: {
                ...state.data,
                ...object
            }
        })
    }

    const createUserWithoutPassword = async () => {
        if(!checkRequiredFields()){
            const response = await props.createUserWithoutPassword({
                variables: {
                    user: state.data,
                    companies: state.companies.map(company => company.id)
                }
            });

            if(!response.errors){
                if(response.data.createUserWithoutPassword.id && !fixedCompany){
                    bHistory.push(`/users/edit/${response.data.createUserWithoutPassword.id}`);
                } else {
                    setSuccess(true);
                }
            }else{
                if(response.errors[0].originalError.original.constraint === "users_email_key"){
                    setState({
                        errors: {
                            email: translate.register_exists_email
                        }
                    })
                }
            }
        }
    }

    function checkRequiredFields() {
        let errors = {
            email: '',
            name: '',
            surname: '',
            phone: ''
        }

        let hasError = false;
        const { data } = state;

        if(data.email.trim().length === 0){
            hasError = true;
            errors.email = translate.required_field;
        }else{
            if(!checkValidEmail(data.email)){
                hasError = true;
                errors.email = translate.tooltip_invalid_email_address;
            }
        }

        if(data.name.trim().length === 0){
            hasError = true;
            errors.name = translate.required_field;
        }

        if(data.surname.trim().length === 0){
            hasError = true;
            errors.surname = translate.required_field;
        }

        setState({
            errors
        });

        return hasError;

    }

    if(props.data.loading){
        return <LoadingSection />
    }


    const body = () => (
        <React.Fragment>
            <UserForm
                translate={translate}
                data={state.data}
                errors={state.errors}
                updateState={updateState}
                languages={props.data.languages}
            />
            {success &&
                <div style={{margin: '2em 0em'}}>
                    Se le ha enviado un <b>email de confirmación</b> al usuario para que pueda completar su registro indicando su <b>contraseña</b>.
                </div>
            }
            {!fixedCompany &&
                <CompanyLinksManager
                    linkedCompanies={state.companies}
                    translate={translate}
                    addCheckedCompanies={companies => setState({
                        companies
                    })}
                />
            }
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                {!success?
                    <React.Fragment>
                        <BasicButton
                            text={translate.back}
                            textStyle={{textTransform: 'none', color: 'black', fontWeight: '700'}}
                            onClick={props.requestClose}
                            buttonStyle={{marginRight: '5em'}}
                        />
                        <BasicButton
                            text={translate.save}
                            color={getPrimary()}
                            icon={<ButtonIcon type="save" color="white" />}
                            textStyle={{textTransform: 'none', color: 'white', fontWeight: '700'}}
                            onClick={createUserWithoutPassword}
                        />
                    </React.Fragment>
                :
                    <BasicButton
                        text={translate.back}
                        textStyle={{textTransform: 'none', color: 'black', fontWeight: '700'}}
                        onClick={props.requestClose}
                        buttonStyle={{marginRight: '5em'}}
                    />
                }

            </div>
        </React.Fragment>
    )

    return(
        <div style={{height: !fixedCompany? 'calc(100vh - 3em)' : '100%'}}>
            {fixedCompany?
                body()
            :
                <CardPageLayout title={translate.users_add}>
                    {body()}
                </CardPageLayout>
            }

        </div>
    )
}


const createUserWithoutPassword = gql`
    mutation CreateUserWithoutPassword($user: UserInput!, $companies: [Int]){
        createUserWithoutPassword(user: $user, companies: $companies){
            id
        }
    }
`;



export default compose(
    graphql(languages),
    graphql(createUserWithoutPassword, {
        name: 'createUserWithoutPassword'
    })
)(NewUser);