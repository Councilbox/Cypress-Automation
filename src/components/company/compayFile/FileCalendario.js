import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput, DropDownMenu, Table } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { TableRow, TableCell, TableHead, TableBody, MenuItem } from 'material-ui';
import { getPrimary, primary } from '../../../styles/colors';
import Calendar from 'react-calendar';
import AddCompanyNotificationMenu from './AddCompanyNotificationMenu';
import { moment } from '../../../containers/App';



const FileCalendario = ({ translate, company, client, ...props }) => {
    const [data, setData] = React.useState([]);
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

        console.log(response);

        setData(response.data.companyNotifications);
    }, [company.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    const getTileClassName = ({ date }) => {
        console.log(date)
        return '';
    }

    const updateCompanyNotification = async (value, index) => {
        const newValues = {
            ...data[index],
            ...value,
            __typename: undefined
        };

        const response = await client.mutate({
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* <div style={{ paddingRight: "1em", fontSize: "22px" }} >
                        onClick={changeMonthBack}
                        <i className="fa fa-angle-left" ></i>
                    </div>
                    <DropDownMenu
                        color="transparent"
                        styleComponent={{ width: "" }}
                        Component={() =>
                            <div
                                style={{
                                    borderRadius: '3px',
                                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
                                    padding: "0.5em 1em"
                                }}
                            >
                                <span style={{ color: primary, fontWeight: "bold" }}>Diciembre</span>
                            </div>
                        }
                        textStyle={{ color: primary }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        type="flat"
                        items={
                            <div style={{ padding: "0.5em" }}>
                                <Calendar
                                    showNeighboringMonth={false}
                                    // onChange={onChangeDay}
                                    // value={daySelected}
                                    minDetail={'month'}
                                    tileClassName={date => getTileClassName(date)}
                                // onClickDay={(value) => clickDay(value)}
                                />
                            </div>
                        }
                    /> 
                    <div style={{ paddingLeft: "1em", fontSize: "22px" }} >
                        <i className="fa fa-angle-right" >
                        </i>
                    </div>*/}
                </div>
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
                            <div style={{maxWidth: '300px'}}>
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
                                    <TableRow>
                                        <TableCell style={{ color: "black" }}>{moment(notification.limitDate).format('L')}</TableCell>
                                        <TableCell style={{ color: "black" }}>{notification.action}</TableCell>
                                        <TableCell style={{ color: "black" }}>
                                            {notification.description}
                                        </TableCell>
                                        <TableCell style={{ color: primary }}>
                                            <SelectInput
                                                value={notification.state}
                                                onChange={event => {
                                                    console.log(event.target.value);
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