import React from 'react';
import { Button } from 'material-ui';
import NewTranslationModal from './NewTranslationModal';


const EditTranslationsModal = ({ translation, translate, refresh }) => {
    const [edit, setEdit] = React.useState(false);

    const showEditTraductions = () => {
        setEdit(true);
    }

    const closeEditTraductions = () => {
        setEdit(false);
    }

    return (
        <React.Fragment>

            <Button size="small" color="primary" onClick={showEditTraductions} >
                Editar
                <i className="fa fa-pencil-square-o" style={{ paddingLeft: "5px", paddingTop: "2px", fontSize: "16px" }}></i>
            </Button>

            <NewTranslationModal
                refresh={refresh}
                open={edit}
                requestClose={closeEditTraductions}
                translate={translate}
                values={translation}
            />
        </React.Fragment>
    );
}

export default EditTranslationsModal