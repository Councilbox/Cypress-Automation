import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { DateTimePicker, BasicButton, TextInput } from '../../../displayComponents';


const AddCompanyNotificationMenu = ({
 refetch, company, translate, client
}) => {
    const defaultState = {
        limitDate: null,
        description: '',
        action: '',
        companyId: company.id
    };

    const [notification, setNotification] = React.useState(defaultState);

    const createNotification = async () => {
        await client.mutate({
            mutation: gql`
                mutation CreateCompanyNotification($notification: CompanyNotificationInput){
                    createCompanyNotification(notification: $notification){
                        id
                        state
                    }
                }
            `,
            variables: {
                notification
            }
        });

        setNotification(defaultState);
        refetch();
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{ color: 'black' }}>
                <DateTimePicker
                    format="L"
                    onlyDate
                    onChange={date => {
                        let dateString = null;
                        if (date) {
                            const newDate = new Date(date);
                            dateString = newDate.toISOString();
                        }
                        setNotification({
                            ...notification,
                            limitDate: dateString
                        });
                    }}

                    value={notification.limitDate}
                />
            </div>
            <div style={{ color: 'black' }}>
                <TextInput
                    floatingText={'Acción'}
                    value={notification.action}
                    onChange={event => {
                        setNotification({
                            ...notification,
                            action: event.target.value
                        });
                    }}
                />
            </div>
            <div style={{ color: 'black' }}>
                <TextInput
                    floatingText={translate.description}
                    value={notification.description}
                    onChange={event => {
                        setNotification({
                            ...notification,
                            description: event.target.value
                        });
                    }}
                />
            </div>
            <BasicButton
                text={translate.save}
                onClick={createNotification}
            />
        </div>
    );
};

export default withApollo(AddCompanyNotificationMenu);
