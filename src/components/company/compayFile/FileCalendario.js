import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { TableRow, TableCell, MenuItem } from 'material-ui';
import { SelectInput, Table, AlertConfirm } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary } from '../../../styles/colors';
import AddCompanyNotificationMenu from './AddCompanyNotificationMenu';
import { moment } from '../../../containers/App';



const FileCalendario = ({ translate, company, client }) => {
    const [data, setData] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [showCreateMenu, setShowCreateMenu] = React.useState(false);
    const primary = getPrimary();

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query CompanyNotifications($companyId: Int!){
                    companyNotifications(companyId: $companyId){
                        id
                        limitDate
                        action
                        description
                        state
                    }
                }
            `,
            variables: {
                companyId: company.id
            }
        });

        setData(response.data.companyNotifications);
    }, [company.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);


    const deleteCompanyNotification = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation DeleteCompanyNotificatio($notificationId: Int!){
                    deleteCompanyNotification(notificationId: $notificationId){
                        success
                    }
                }
            `,
            variables: {
                notificationId: modal
            }
        });
        if(response.data.deleteCompanyNotification){
            getData();
            setModal(null);
        }
    }

    const showDeleteWarningModal = id => {
        setModal(id);
    }

    const closeDeleteWarningModal = () => {
        setModal(false);
    }

    const updateCompanyNotification = async (value, index) => {
        const newValues = {
            ...data[index],
            ...value,
            __typename: undefined
        };

        await client.mutate({
            mutation: gql`
                mutation UpdateCompanyNotification($notification: CompanyNotificationInput){
                    updateCompanyNotification(notification: $notification){
                        id
                        state
                    }
                }
            `,
            variables: {
                notification: newValues
            }
        });

        getData();
    }


    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: '0px 1em 1em', height: '100%', }}>
                <AlertConfirm
                    open={modal}
                    requestClose={closeDeleteWarningModal}
                    title={translate.warning}
                    bodyText={'¿Desea eliminar este elemento?'
                    }
                    acceptAction={deleteCompanyNotification}
                    buttonCancel={translate.cancel}
                    buttonAccept={translate.accept}
                />
                <div style={{ marginTop: "1em" }}>
                    <div>
                        <div style={{ fontWeight: "bold", color: primary, display: "flex", alignItems: "center" }}>
                            {translate.add}
                            <i
                                className={'fa fa-plus-circle'}
                                onClick={() => setShowCreateMenu(!showCreateMenu)}
                                style={{ color: primary, cursor: "pointer", fontSize: "25px", paddingLeft: "5px" }}
                            />
                        </div>
                        {showCreateMenu &&
                            <div style={{ maxWidth: '300px' }}>
                                <AddCompanyNotificationMenu
                                    company={company}
                                    translate={translate}
                                    refetch={getData}
                                />
                            </div>
                        }
                        <Table
                            style={{ width: "100%", maxWidth: "100%" }}
                        >
                            <TableRow>
                                <TableCell style={{ color: primary, fontWeight: "bold" }}>Fecha límite </TableCell>
                                <TableCell style={{ color: primary, fontWeight: "bold" }}>Acción</TableCell>
                                <TableCell style={{ color: primary, fontWeight: "bold" }}>{translate.description}</TableCell>
                                <TableCell style={{ color: primary, fontWeight: "bold" }}>Status</TableCell>
                            </TableRow>
                            {data.length > 0 &&
                                data.map((notification, index) => (
                                    <TableRow key={notification.id}>
                                        <TableCell style={{ color: "black" }}>{moment(notification.limitDate).format('L')}</TableCell>
                                        <TableCell style={{ color: "black" }}>{notification.action}</TableCell>
                                        <TableCell style={{ color: "black" }}>
                                            {notification.description}
                                        </TableCell>
                                        <TableCell style={{ color: primary, display: 'flex', alignItems: 'center' }}>
                                            <SelectInput
                                                value={notification.state}
                                                onChange={event => {
                                                    updateCompanyNotification({
                                                        state: event.target.value,
                                                    }, index)
                                                }}
                                            >
                                                <MenuItem value={0}>
                                                    Pendiente
                                                </MenuItem>
                                                <MenuItem value={1}>
                                                    Finalizada
                                                </MenuItem>
                                            </SelectInput>
                                            <div style={{
                                                background: "white",
                                                width: "10%",
                                                color: primary,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "25px",
                                                marginLeft: '0.6em'
                                            }}>
                                                <i className={"fa fa-times-circle"} onClick={() => showDeleteWarningModal(notification.id)} style={{ cursor: "pointer", }} ></i>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                            ))}
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withTranslations()(withApollo(FileCalendario));
