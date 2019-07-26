import React from 'react';
import { arrayMove } from "react-sortable-hoc";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Grid, Card } from 'material-ui';
import { GridItem } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';


const OrdenarPrueba = ({ }) => {
    const [agendas, setAgendas] = React.useState({
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    }
    );

    const addItem = (item) => {
        console.log(item)
        agendas.items.push(item)
        setAgendas(agendas)
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setAgendas(({ items }) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

console.log(agendas)
    return (
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{ border: "1px solid black", width: "50%" }}>
                <Grid style={{ display: "flex" }}>
                    <GridItem xs={2} md={2} lg={2} style={{ border: "1px solid black" }} onClick={() => addItem('aaa')}>
                        <div>ICONO</div>
                        <div>Text</div>
                    </GridItem>
                    <GridItem xs={2} md={2} lg={2} style={{ border: "1px solid black" }}>
                        <div>ICONO</div>
                        <div>Text1</div>
                    </GridItem>
                    <GridItem xs={2} md={2} lg={2} style={{ border: "1px solid black" }}>
                        <div>ICONO</div>
                        <div>Text3</div>
                    </GridItem>
                </Grid>
            </div>
            <div style={{ border: "1px solid black", width: "50%" }}>
                <SortableList
                    list={agendas}
                    items={agendas.items}
                    offset={agendas.items.lenght}
                    onSortEnd={onSortEnd}
                    helperClass="draggable"
                />
            </div>
        </div>
    )

}

const SortableList = SortableContainer(({ items, offset = 0, list }) => {



    return (
        <div>
            {items.map((item, index) => (
                <DraggableBlock
                    key={`item-${index}`}
                    index={offset + index}
                    value={item}
                />
            ))}
        </div>
    );
});


const DraggableBlock = SortableElement((props) => {

    const removeItem = () => {
        console.log("AAAAA")
        // e.preventDefault()
    }

    return (
        <Card
            style={{
                opacity: 1,
                width: "100%",
                color: getPrimary(),
                display: "flex",
                alignItems: "center",
                padding: "0.5em",
                height: "3em",
                border: `2px solid ${getPrimary()}`,
                listStyleType: "none",
                borderRadius: "3px",
                cursor: "grab",
                marginTop: "0.5em",
                justifyContent: "space-between"
            }}
            className="draggable"
        >
            {props.value}
            <div style={{ width: "50px", background: "red" }} onClick={event => {
                event.stopPropagation();
                event.preventDefault();
                console.log("AAAAA");
            }}
            >x</div>
        </Card>
    );
});

export default OrdenarPrueba;