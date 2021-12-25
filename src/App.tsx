import React, { useState } from 'react';
import './App.css';
import Chart from './Components/Chart';
import Table from './Components/Table';
import { fetchRowData } from './misc/CommonUtils';

export const CHART_HEIGHT = 400;
export const OFFSET_X = 400;
export const OFFSET_Y = 200;


export interface IDisplayItem {
  label: string;
  x: number;
  y: number;
}

function App() {
  const fetchedRows = fetchRowData();
  const [rows, setRows] = useState(fetchedRows);  
  return (
    <>
      <div style={{ top: OFFSET_Y, position: "absolute", left: OFFSET_X }}>
        <Chart rows={rows} setRows={setRows} />
      </div>
      <div style={{ top: "25%", position: "absolute", left: OFFSET_X * 2.1 }}>
        <Table setRows={setRows} rows={rows} />
      </div>
    </>
  );
}

export default App;
