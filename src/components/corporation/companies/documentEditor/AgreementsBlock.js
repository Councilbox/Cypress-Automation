import React from 'react';
import { getPrimary } from '../../../../styles/colors';
import { IconsDragActions } from '../OrdenarPrueba';
import Block from './Block';

const AgreementsBlock = ({ translate, item, expand, hoverFijo, hoverAndSave, setText, ...props }) => {
    //const [expand, setExpand] = React.useState(false);
    console.log(item);

    return (
        <React.Fragment>
            {item.items.map(item => (
                <Block
                    value={item}
                    hoverFijo={hoverFijo}
                    hoverAndSave={hoverAndSave}
                    setText={setText}
                />
            ))}
        </React.Fragment>
    )
}

export default AgreementsBlock;