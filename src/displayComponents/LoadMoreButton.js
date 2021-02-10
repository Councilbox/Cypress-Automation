import React from 'react';
import { Card, MenuItem } from 'material-ui';
import { LoadingSection } from '.';
import withTranslations from '../HOCs/withTranslations';

const LoadMoreButton = ({ loading, onClick }) => (
        <Card
            style={{
                width: '90%',
                border: '2px solid grey',
                margin: 'auto',
                marginBottom: '1.2em',
                marginTop: '0.6em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            elevation={1}
            onClick={onClick}
        >
            <MenuItem style={{
 padding: 0, width: '100%', height: '2em', display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
}}>
                Cargar más
                {loading
                    && <div>
                        <LoadingSection size={25} />
                    </div>
                }
            </MenuItem>
        </Card>
    );

export default withTranslations()(LoadMoreButton);
