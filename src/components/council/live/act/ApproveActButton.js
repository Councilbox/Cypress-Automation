import React from 'react';
import { BasicButton, Icon } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import { withApollo } from 'react-apollo';
import { approveAct } from '../../../../queries';

const ApproveActButton = ({ translate, council, client, refetch }) => {
    const [modal, setModal] = React.useState(false);
    const primary = getPrimary();
    const [act, setAct] = React.useState({});


    const finishAct = async () => {
        const response = await client.mutate({
            mutation: approveAct,
            variables: {
                councilId: council.id,
                closeCouncil: true
            }
        });

        console.log(response);

        refetch();
    }

    return (
        <ConfigContext.Consumer>
            {config => (
                <React.Fragment>
                    <BasicButton
                        text={translate.finish_and_aprove_act}
                        color={primary}
                        textPosition="before"
                        onClick={finishAct}
                        icon={
                            <Icon
                                className="material-icons"
                                style={{
                                    fontSize: "1.1em",
                                    color: "white"
                                }}
                            >
                                play_arrow
                            </Icon>
                        }
                        textStyle={{
                            color: "white",
                            fontSize: "0.7em",
                            fontWeight: "700",
                            textTransform: "none"
                        }}
                    />
                </React.Fragment>
            )}
        </ConfigContext.Consumer>
    )
}


export default withApollo(ApproveActButton);