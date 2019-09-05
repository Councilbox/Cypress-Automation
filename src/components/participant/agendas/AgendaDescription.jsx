import React from 'react';

const AgendaDescription = ({ agenda }) => {
    const [open, setOpen] = React.useState(false);

    const toggle = () => {
        setOpen(!open);
    }

    return (
        <div
            dangerouslySetInnerHTML={{ __html: agenda.description}}
            style={{ width: '100%'}} className={open? 'overflowNoEllipsisDangerousHtml' : "overflowEllipsisDangerousHtml"}
            onClick={toggle}
        ></div>
    )
}

export default AgendaDescription;
