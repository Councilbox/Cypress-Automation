import React from 'react';
import { BorderBox } from './Block';

const AgreementsPreview = ({ item, translate }) => {
    return (
        <div>
            {item.items.map(block => {
                return (
                    block.logic?
                        <BorderBox
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

                    <div dangerouslySetInnerHTML={{__html: block.text}} style={{marginTop: '2em'}} />
                )
            })}
        </div>
    )
}

export default AgreementsPreview;