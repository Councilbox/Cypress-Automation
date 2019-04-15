import React from "react";
import FontAwesome from "react-fontawesome";
import { getSecondary, getPrimary } from "../../../styles/colors";
import { MenuItem } from 'material-ui';
import { DateWrapper, BasicButton } from '../../../displayComponents';
import { USER_ACTIVATIONS } from '../../../constants';
import CloseSessionButton from './CloseSessionButton';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';


class UserItem extends React.Component {

    activatePremium = async event => {
        event.stopPropagation();
        const response = await this.props.activateUserPremium({
            variables: {
                userId: this.props.user.id
            }
        });

        if (!response.errors) {
            this.props.refetch();
        }
    }

    cancelUserPremium = async event => {
        event.stopPropagation();
        const response = await this.props.cancelUserPremium({
            variables: {
                userId: this.props.user.id
            }
        });

        if (!response.errors) {
            this.props.refetch();
        }
    }

    unsubscribeUser = async event => {
        event.stopPropagation();
        const response = await this.props.unsubscribeUser({
            variables: {
                userId: this.props.user.id
            }
        });

        this.props.refetch();
    }

    render() {
        const { user, translate, clickable, closeSession } = this.props;
        const secondary = getSecondary();

        const bodyTable = () => (
            <React.Fragment>
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                    <div style={{ width: "15%", padding: "4px 70px 4px 0px" }}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            {user.actived === USER_ACTIVATIONS.CONFIRMED &&
                                <React.Fragment>
                                    <i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: 'grey' }}></i>
                                    Confirmado
                            </React.Fragment>
                            }
                            {user.actived === USER_ACTIVATIONS.NOT_CONFIRMED &&
                                <React.Fragment>
                                    <i className="fa fa-user-times" aria-hidden="true" style={{ fontSize: '1.7em', color: 'grey' }}></i>
                                    No confirmado
                            </React.Fragment>
                            }
                            {user.actived === USER_ACTIVATIONS.FREE_TRIAL &&
                                <React.Fragment>
                                    <i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: secondary }}></i>
                                    {translate.free_trial}
                                </React.Fragment>
                            }
                            {user.actived === USER_ACTIVATIONS.PREMIUM &&
                                <React.Fragment>
                                    <i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: getPrimary() }}></i>
                                    Premium
                            </React.Fragment>
                            }
                        </div>
                    </div>
                    <div style={{ width: "10%", padding: "4px 8px 4px 0px", whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{`${user.id}`}</span>
                    </div>
                    <div style={{ width: "25%", padding: "4px 8px 4px 0px", whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{`${user.name} ${user.surname}`}</span>
                    </div>
                    <div style={{ width: "25%", padding: "4px 8px 4px 0px", whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis' }}>
                        <span style={{ fontSize: '0.9rem' }}>{`${user.email || '-'}`}</span>
                    </div>
                    <div style={{ width: "25%", padding: "4px 8px 4px 0px", whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis' }}>
                        {!!user.lastConnectionDate ?
                            <DateWrapper
                                format="DD/MM/YYYY HH:mm"
                                date={user.lastConnectionDate}
                                style={{ fontSize: '0.7em' }}
                            />
                            :
                            '-'
                        }
                    </div>
                </div>
            </React.Fragment>
        )
        const body = () => (
            <React.Fragment>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <div
                        style={{
                            width: '8em',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        {user.actived === USER_ACTIVATIONS.CONFIRMED &&
                            <React.Fragment>
                                <i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: 'grey' }}></i>
                                Confirmado
                            </React.Fragment>
                        }
                        {user.actived === USER_ACTIVATIONS.NOT_CONFIRMED &&
                            <React.Fragment>
                                <i className="fa fa-user-times" aria-hidden="true" style={{ fontSize: '1.7em', color: 'grey' }}></i>
                                No confirmado
                            </React.Fragment>
                        }
                        {user.actived === USER_ACTIVATIONS.FREE_TRIAL &&
                            <React.Fragment>
                                <i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: secondary }}></i>
                                {translate.free_trial}
                            </React.Fragment>
                        }
                        {user.actived === USER_ACTIVATIONS.PREMIUM &&
                            <React.Fragment>
                                <i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: getPrimary() }}></i>
                                Premium
                            </React.Fragment>
                        }
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingLeft: '1.4em'
                        }}
                    >
                        <div>
                            <FontAwesome
                                name={'info'}
                                style={{
                                    marginRight: "0.5em",
                                    color: secondary,
                                    fontSize: '0.7em'
                                }}
                            />
                            <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{`${user.name} ${user.surname} ID: ${user.id}`}</span>
                        </div>
                        <div>
                            <FontAwesome
                                name={'at'}
                                style={{
                                    marginRight: "0.5em",
                                    color: secondary,
                                    fontSize: '0.7em'
                                }}
                            />
                            <span style={{ fontSize: '0.7rem' }}>{`${user.email || '-'}`}</span>
                        </div>
                        <div>
                            <FontAwesome
                                name={'sign-in'}
                                style={{
                                    marginRight: "0.5em",
                                    color: secondary,
                                    fontSize: '0.7em'
                                }}
                            />
                            <span style={{ fontSize: '0.7rem' }}>{`${translate.last_connection}: `}</span>
                            {!!user.lastConnectionDate ?
                                <DateWrapper
                                    format="DD/MM/YYYY HH:mm"
                                    date={user.lastConnectionDate}
                                    style={{ fontSize: '0.7em' }}
                                />
                                :
                                '-'
                            }
                        </div>
                    </div>
                </div>
                {closeSession &&
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10em'
                        }}
                    >
                        <CloseSessionButton
                            user={user}
                            translate={translate}
                        />
                    </div>

                }
                {this.props.unsubscribeUser &&
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10em'
                        }}
                    >
                        <BasicButton
                            text="Dar de baja"
                            color={secondary}
                            textStyle={{ fontWeight: '700', color: 'white' }}
                            onClick={this.unsubscribeUser}
                        />
                    </div>
                }
                {this.props.activatePremium &&
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10em'
                        }}
                    >
                        {user.actived !== USER_ACTIVATIONS.PREMIUM ?
                            <BasicButton
                                text="Activar Premium"
                                color={secondary}
                                textStyle={{ fontWeight: '700', color: 'white' }}
                                onClick={this.activatePremium}
                            />
                            :
                            <BasicButton
                                text="Cancelar Premium"
                                color={secondary}
                                textStyle={{ fontWeight: '700', color: 'white' }}
                                onClick={this.cancelUserPremium}
                            />
                        }
                    </div>
                }
            </React.Fragment>
        )

        return (
            clickable ?
                <MenuItem
                    style={{
                        borderBottom: '1px solid gainsboro',
                        height: '3.5em',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    {bodyTable()}
                    {/* {body()} */}
                </MenuItem>
                :
                <div
                    style={{
                        border: '1px solid gainsboro',
                        height: '3.5em',
                        width: '100%',
                        minHeight: '4.5em',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* {bodyTable()} */}
                    {body()}
                </div>
        )
    }
}


const activateUserPremium = gql`
    mutation ActivateUserPremium($userId: Int!){
        activateUserPremium(userId: $userId){
            success
        }
    }
`;

const cancelUserPremium = gql`
    mutation CancelUserPremium($userId: Int!){
        cancelUserPremium(userId: $userId){
            success
        }
    }
`;

export default compose(
    graphql(activateUserPremium, {
        name: 'activateUserPremium'
    }),
    graphql(cancelUserPremium, {
        name: 'cancelUserPremium'
    })
)(UserItem);