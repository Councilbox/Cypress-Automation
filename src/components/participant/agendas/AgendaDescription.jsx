import React from 'react';
import { CollapsibleSection } from '../../../displayComponents';

const AgendaDescription = ({ agenda }) => {
    const [open, setOpen] = React.useState(true);

    const toggle = () => {
        setOpen(!open);
    }

    return (
        <CollapsibleSection
            controlled
            open={open}
            trigger={() =>
                open?
                <span/>
                :
                <div
                    dangerouslySetInnerHTML={{ __html: agenda.description}}
                    style={{ width: '100%', height: '2em', overflow: 'hidden'}} className={"overflowEllipsisDangerousHtml"}
                    onClick={toggle}
                ></div>
            }
            collapse={() =>
                <div
                    dangerouslySetInnerHTML={{ __html: agenda.description}}
                    style={{ width: '100%'}}
                    onClick={toggle}
                ></div>
            }
        >

        </CollapsibleSection>

    )
}

export default AgendaDescription;
