import React, { useState } from "react";
import Chart from "./Components/Chart";
import Table from "./Components/Table";
import { fetchRowData } from "./misc/CommonUtils";
import styled from "styled-components";
import DraggableGraph from "./Components/Deneme";

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
    <LeftGrid>
      <DraggableGraph width={600} height={600} />
    </LeftGrid>
  );
}

const LeftGrid = styled.div`
  padding: 10%;
`;

const RightGrid = styled.div`
  position: absolute;
  top: 20%;
  left: ${OFFSET_X * 2.1 + "px"};
`;

export default App;
