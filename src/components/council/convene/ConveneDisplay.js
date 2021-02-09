import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Paper } from 'material-ui';
import withWindowSize from '../../../HOCs/withWindowSize';
import withTranslations from '../../../HOCs/withTranslations';
import { lightGrey } from '../../../styles/colors';
import { CBXFooter } from '../../../displayComponents';

const ConveneDisplay = ({ match, client, translate, ...props }) => {
    const [convene, setConvene] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        getConvene();
    }, [match.params.id]);

    const getConvene = async () => {
        const response = await client.query({
            query: gql`
                query CouncilHTMl($councilId: Int!){
                    councilPublicConvene(councilId: $councilId)
                }
            `,
            variables: { councilId: +match.params.id },
            fetchPolicy: 'network-only'
        });

        if(response.errors){
            setError(response.errors[0].code);
        }

        if(response.data.councilPublicConvene){
            setConvene(response.data.councilPublicConvene);
        }
    };

    return (
        <div
            style={{
                backgroundColor: lightGrey,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'auto',
                alignItems: 'center',
            }}
        >
            <Paper
                className={props.windowSize !== 'xs' ? 'htmlPreview' : ''}
                style={{
                    marginTop: '2em',
                    marginBottom: '1em'
                }}
            >
                {!error ?
                    <div
                        dangerouslySetInnerHTML={{ __html: convene }}
                        style={{
                            padding: '2em',
                            cursor: 'pointer',
                            margin: '0 auto'
                        }}
                    />
                :
                    <div
                        style={{
                            width: '100%',
                            marginTop: '2em',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: '700',
                            fontSize: '1.1em',
                            flexDirection: 'column'
                        }}
                    >
                        <img src="/img/logo-icono.png" style={{ height: '3em' }} alt="councilbox-logo" />
                        {error === 400 &&
                            'La convocatoria no es de acceso público'
                        }
                        {error === 404 &&
                            'No existe esa reunión'
                        }
                    </div>
                }

            </Paper>
            <CBXFooter />
        </div>
    );
};

export default withTranslations()(withWindowSize(withApollo(ConveneDisplay)));
