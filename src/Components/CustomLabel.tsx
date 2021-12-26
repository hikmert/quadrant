import React from 'react';
import styled from 'styled-components';
import { ColorCodes } from '../misc/ColorCodes';

interface ICustomLabel {
    label: string;
    chartLabel: boolean;
    xPosition?: number;
    yPosition?: number;
    width?: number
}

interface IChartLabel {
    top: number;
    left: number;
}

interface ITableLabel {
    width: number;
}

function CustomLabel(props: ICustomLabel) {
    return props.chartLabel
        ? <ChartLabel top={props.yPosition || 0} left={props.xPosition || 0}>{props.label}</ChartLabel>
        : <TableLabel width={props.width || 0}>{props.label}</TableLabel>
}

export default CustomLabel;


const ChartLabel = styled("p") <IChartLabel>`
    position: absolute;
    background: ${ColorCodes.LIGHT_BLUE};
    color: ${ColorCodes.WHITE}; 
    padding: 5px;
    border-radius: 5px;
    top: ${props=>  `${props.top}px`};
    left: ${props => `${props.left}px`}
`;

const TableLabel = styled("p") <ITableLabel>`
    width: ${props => `${props.width}px`};
    background: ${ColorCodes.LIGHT_BLUE};
    color: ${ColorCodes.WHITE};
    margin-left: 5px;
    text-align: center;
    border-radius: 3px;
    font-family: sans-serif
`;
