import React from 'react';
import { getSecondary } from '../../../styles/colors';
import { Button } from 'material-ui';
import NewTranslationModal from './NewTranslationModal';



const EditTranslationsModal = ({ translation, translate, refresh }) => {
    const secondary = getSecondary();
    const [edit, setEdit] = React.useState(false);


    const showeditTraducciones = () => {
        setEdit(true);
    }

    const closeeditTraducciones = () => {
        setEdit(false);
    }

    return (
        <React.Fragment>

            <Button size="small" color="primary" onClick={showeditTraducciones} >
                Editar
                        <i className="fa fa-pencil-square-o" style={{ paddingLeft: "5px", paddingTop: "2px", fontSize: "16px" }}></i>
            </Button>

            <NewTranslationModal
                refresh={refresh}
                open={edit}
                requestClose={closeeditTraducciones}
                translate={translate}
                values={translation}
            />
        </React.Fragment>
    );
}

export default EditTranslationsModal