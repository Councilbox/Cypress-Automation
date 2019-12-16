import React from 'react';
import { BorderBox } from './Block';

const AgreementsPreview = ({ item, translate, column }) => {
    return (
        <div>
            {item.items.map(block => {
                return (
                    block.logic?
                        <BorderBox
                            key={block.id}
                            itemInfo={288}
                            icon={block.icon}
                            id={block.id}
                            colorBorder={block.colorBorder}
                            stylesBody={{ width: "98%" }}
                            noIcon={true}
                        >
                            <div >
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>{block.label}</div>
                            </div>
                        </BorderBox>
                    :

                    <div dangerouslySetInnerHTML={{__html: column === 2? block.secondaryText : block.text}} style={{marginTop: '2em'}} key={block.id}/>
                )
            })}
        </div>
    )
}

export default AgreementsPreview;