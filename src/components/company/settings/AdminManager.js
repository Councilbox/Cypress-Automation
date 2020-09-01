import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton, LoadingSection } from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import AddAdmin from './AddAdmin';

const AdminManager = ({ company, translate, client }) => {
    const [modal, setModal] = React.useState(false);
    const [admins, setAdmins] = React.useState(null);
    const [page, setPage] = React.useState(1);
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

        if(page === 3){
            return (
                <AddAdmin
                    company={company}
                    admins={admins}
                    translate={translate}
                    refetch={getAdmins}
                />
            );
        }

        return (
            <div>
                <div>
                    <BasicButton
                        text={translate.select_user}
                        color={primary}
                        floatRight
                        textStyle={{
                            color: "white",
                            fontWeight: "700"
                        }}
                        buttonStyle={{ marginRight: "1.2em" }}
                        onClick={() => setPage(3)}
                    />
                </div>
                <div>
                    {admins.length > 0?
                        admins.map(admin => <div>{`${admin.name} ${admin.surname || ''} - ${admin.email}`}</div>)
                    :
                        translate.no_results
                    }
                </div>

            </div>
        )
    }

    return (
        <React.Fragment>
            <BasicButton
                text={translate.admins}
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
                title={translate.admins}
                requestClose={() => {
                    page === 1? setModal(false) : setPage(1)}
                }
            />
        </React.Fragment>
    )
}

export default withApollo(AdminManager);