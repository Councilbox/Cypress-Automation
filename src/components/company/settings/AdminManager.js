import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton, LoadingSection } from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";

const AdminManager = ({ company, translate, client }) => {
    const [modal, setModal] = React.useState(false);
    const [admins, setAdmins] = React.useState(null);
    const primary = getPrimary();

    const getAdmins = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query company($companyId: Int!){
                    companyAdmins(companyId: $companyId){
                        name
                        surname
                        email
                        id
                        lastConnectionDate
                    }
                }
            `,
            variables: {
                companyId: company.id
            }
        });

        setAdmins(response.data.companyAdmins);
    }, [company.id]);

    React.useEffect(() => {
        if(modal){
            getAdmins();
        }
    }, [getAdmins, modal]);

    const renderModalBody = () => {
        if(!admins){
            return <LoadingSection />
        }

        return (
            <div>
                {admins.map(admin => <div>{`${admin.name} ${admin.surname}`}</div>)}
            </div>
        )
    }

    return (
        <React.Fragment>
            <BasicButton
                text={'Ver administradores'}
                color={primary}
                floatRight
                textStyle={{
                    color: "white",
                    fontWeight: "700"
                }}
                buttonStyle={{ marginRight: "1.2em" }}
                onClick={() => setModal(true)}
            />
            <AlertConfirm
                open={modal}
                bodyText={renderModalBody()}
                title={'Administradores'}
                requestClose={() => setModal(false)}
            />
        </React.Fragment>
        
    )
}

export default withApollo(AdminManager);