import React from 'react';


const AgreementsPreview = ({ item, translate }) => {

    console.log(item.items);

    return (
        <div>
            {item.items.map(block => {
                return (
                    <div dangerouslySetInnerHTML={{__html: block.text}}>

                    </div>
                )
            })}
        </div>
    )
}

export default AgreementsPreview;