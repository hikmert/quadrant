import { IDisplayItem } from "../App";

export const saveToLocalStorage = (rows: IDisplayItem[]) => localStorage.setItem("rows", JSON.stringify(rows))

export const fetchRowData = () => {
    const rows = localStorage.getItem('rows');
    let result: IDisplayItem[] = [];
    if(rows){
        result = JSON.parse(rows);
    }
    return result;
}
