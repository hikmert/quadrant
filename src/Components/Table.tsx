import React from 'react';
import { CHART_HEIGHT, IDisplayItem } from '../App';
import { saveToLocalStorage } from '../misc/CommonUtils';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';
import CustomLabel from './CustomLabel';

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
            <CustomButton label="Add" onClick={addRow} />
            <br />
            <div style={{ display: "inline-flex" }}>
                <CustomLabel width={200} label='Label' chartLabel={false} />
                <CustomLabel width={110} label='Vision' chartLabel={false} />
                <CustomLabel width={100} label='Ability' chartLabel={false} />
                <CustomLabel width={50} label='Delete' chartLabel={false} />
            </div>
            {rows.map((row: IDisplayItem, index: number) =>
                <form key={index + "form"}>
                    <CustomInput uniqueKey={index + "label"}
                        value={row.label}
                        textField
                        width={200}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateRow(event, index, InputTypes.Label)}
                    ></CustomInput>
                    <CustomInput uniqueKey={index + "vision"}
                        value={row.x / 4}
                        width={100}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateRow(event, index, InputTypes.X)}>
                    </CustomInput>
                    <CustomInput uniqueKey={index + "ability"}
                        value={(CHART_HEIGHT - row.y) / 4}
                        width={90}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateRow(event, index, InputTypes.Y)}>
                    </CustomInput>
                    <CustomButton label="Delete" onClick={() => deleteItem(index)} />
                </form>)}
        </>
    );
}

export default Table;


