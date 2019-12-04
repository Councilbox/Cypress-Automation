import React from 'react';
import Block from './Block';

const AgreementsBlock = ({ translate, item, expand, hoverFijo, hoverAndSave, setText, ...props }) => {
    const updateBlock = (index, text) => {
        const newItems = item.items;
        const newItem = {
            ...newItems[index]
        }
        newItem.text = text;
        newItems[index] = newItem;

        props.updateBlock(item.id, {
            ...item,
            items: newItems
        });
    }

    const removeBlock = index => {
        const items = [...item.items];
        let newItem = {
            ...items[index]
        };
        newItem.hide = !newItem.hide;

        items[index] = newItem;

        props.updateBlock(item.id, {
            ...item,
            items
        });
    }

    return (
        <React.Fragment>
            {item.items.map((item, index) => (
                <Block
                    key={index}
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