import React from 'react';
import { getPrimary } from '../../../../styles/colors';
import { IconsDragActions } from '../OrdenarPrueba';
import Block from './Block';

const AgreementsBlock = ({ translate, item, expand, hoverFijo, hoverAndSave, setText, ...props }) => {
    const updateBlock = (index, text) => {
        console.log(text);
        const newItems = item.items;
        newItems[index].text = text;
        props.updateBlock(item.id, {
            ...item,
            items: newItems
        });
    }

    const removeBlock = index => {
        item.items.splice(index, 1);
        props.updateBlock(item.id, {
            ...item,
            items: item.items
        });
    }

    return (
        <React.Fragment>
            {item.items.map((item, index) => (
                <Block
                    value={item}
                    hoverFijo={hoverFijo}
                    hoverAndSave={hoverAndSave}
                    setText={setText}
                    removeBlock={removeBlock}
                    translate={translate}
                    id={index}
                    updateCouncilActa={updateBlock}
                />
            ))}
        </React.Fragment>
    )
}

export default AgreementsBlock;