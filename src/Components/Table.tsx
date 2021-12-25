import React from 'react';
import { CHART_HEIGHT, IDisplayItem } from '../App';
import { saveToLocalStorage } from '../misc/CommonUtils';
import Label from './Label';

interface ITable {
    setRows: (rows: IDisplayItem[]) => void;
    rows: IDisplayItem[];
}

enum InputTypes {
    Label = "Label",
    X = "X",
    Y = "Y"
}

function Table(props: ITable) {
    const { rows } = props;

    const deleteItem = (index: number) => {
        const tempRows = [...rows];
        tempRows.splice(index, 1)
        props.setRows([...tempRows])
        saveToLocalStorage(tempRows)
    }

    const addRow = () => {
        const tempRows = [...rows];
        tempRows.push({ label: "", x: 0, y: CHART_HEIGHT })
        props.setRows(tempRows)
        saveToLocalStorage(tempRows)
    }

    const updateRow = (event: React.ChangeEvent<HTMLInputElement>, index: number, inputType: InputTypes) => {
        const tempRows = [...rows];
        const scaleRatio = 4;
        switch (inputType) {
            case InputTypes.Label:
                tempRows[index].label = event.target.value;
                break;
            case InputTypes.X:
                tempRows[index].x = scaleRatio * Number(event.target.value);
                break;
            case InputTypes.Y:
                tempRows[index].y = CHART_HEIGHT - scaleRatio * Number(event.target.value);
                break;
        }
        props.setRows(tempRows);
        saveToLocalStorage(tempRows)
    }

    return (
        <>
            <button className='button' onClick={addRow}>Add</button>
            <br />
            <div style={{ display: "inline-flex" }}>
                <Label width={205} label='Label' chartLabel={false}/>
                <Label width={110} label='Vision' chartLabel={false}/>
                <Label width={100} label='Ability' chartLabel={false}/>
                <Label width={50} label='Delete' chartLabel={false}/>
            </div>
            {rows.map((row: IDisplayItem, index: number) =>
                <form key={index + "form"}>
                    <input key={index + "label"} type="text" defaultValue={row.label}
                        onChange={(event) => updateRow(event, index, InputTypes.Label)} style={{ width: 200, marginLeft: 5 }} />
                    <input key={index + "vision"} type="number" value={row.x / 4}
                        onChange={(event) => updateRow(event, index, InputTypes.X)} style={{ width: 100, marginLeft: 5 }} max={100} min={0} />
                    <input key={index + "ability"} type="number" value={(CHART_HEIGHT - row.y) / 4}
                        onChange={(event) => updateRow(event, index, InputTypes.Y)} style={{ width: 90, marginLeft: 5, marginRight: 5 }} max={100} min={0} />
                    <button className='button' onClick={() => deleteItem(index)}> Delete</button>
                </form>)}
        </>
    );
}

export default Table;


