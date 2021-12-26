import React from 'react';
import styled from 'styled-components';
import { IDisplayItem } from '../App';
import { ColorCodes } from '../misc/ColorCodes';

interface IChartItem {
    index: number;
    element: IDisplayItem;
    onDragCapture: (event: React.DragEvent<HTMLSpanElement>) => void;
}

interface IDot {
    left: number;
    top: number;
}

function ChartItem(props: IChartItem) {
    const { index, element, onDragCapture} = props;
    return (<div key={"container" + index}>
        <Dot draggable={true} onDragCapture={onDragCapture} onDragEnd={onDragCapture}  key={"dot" + index} left={element.x} top={element.y} ></Dot>
        <Label left={element.x} top={element.y} key={"label" + index}>{element.label}</Label>
    </div>)
}

export default ChartItem;


const Dot = styled.span<IDot>`
    height: 15px;
    width: 15px;
    position: absolute;
    border-radius: 50%;
    display: inline-block;
    left: ${props => `${props.left}px`};
    top: ${props => `${props.top}px`};
    background-color: ${ColorCodes.DARK_BLUE};
`
const Label = styled.p<IDot>`
    position: absolute;
    font-size: 13;
    font-family: sans-serif;
    left: ${props => `${props.left}px`};
    top: ${props => `${props.top}px`};
    color: ${ColorCodes.DARK_BLUE};
`