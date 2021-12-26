import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CHART_HEIGHT, IDisplayItem, OFFSET_X, OFFSET_Y } from '../App';
import { ColorCodes } from '../misc/ColorCodes';
import { saveToLocalStorage } from '../misc/CommonUtils';
import ChartItem from './ChartItem';
import CustomLabel from './CustomLabel';

interface IChart {
  rows: IDisplayItem[] | null;
  setRows: (rows: IDisplayItem[]) => void
}

const Canvas: React.FC<{}> = () => {
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      drawCanvas(canvasCtxRef.current!);
    }
  }, []);

  return (
    <StyledCanvas ref={canvasRef} width={CHART_HEIGHT} height={CHART_HEIGHT} />
  )
};

function drawCanvas(ctx: CanvasRenderingContext2D) {
  const lineWidth = .2;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(CHART_HEIGHT / 2, 0);
  ctx.lineTo(CHART_HEIGHT / 2, CHART_HEIGHT);
  ctx.stroke();
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(0, CHART_HEIGHT / 2);
  ctx.lineTo(CHART_HEIGHT, CHART_HEIGHT / 2);
  ctx.stroke();
}

function Chart(props: IChart) {
  const rows: IDisplayItem[] | null = props.rows || null;

  function setNewDotPosition(event: React.DragEvent<HTMLSpanElement>, index: number) {
    const shouldDrag = (event.clientX > OFFSET_X && event.clientX < CHART_HEIGHT + OFFSET_X && event.clientY > OFFSET_Y && event.clientY < CHART_HEIGHT + OFFSET_Y)
    if (rows && shouldDrag) {
      rows[index].x = event.clientX - OFFSET_X;
      rows[index].y = event.clientY - OFFSET_Y;
      setTimeout(() => {
        props.setRows([...rows]);
      }, 0)
      saveToLocalStorage(rows);
    }
  }

  const onDragCapture = (event: React.DragEvent<HTMLSpanElement>, index: number) => {
    setNewDotPosition(event, index)
  }

  return (
    <>
      <Canvas />
      <Text> Abiliity to execute <span>&#8594;</span></Text>
      <p>Completeness of vision <span>&#8594;</span></p>
      <CustomLabel xPosition={60} yPosition={0} label="Challengers" chartLabel />
      <CustomLabel xPosition={280} yPosition={0} label="Leaders" chartLabel />
      <CustomLabel xPosition={50} yPosition={350} label="Niche Players" chartLabel />
      <CustomLabel xPosition={260} yPosition={350} label="Visionaries" chartLabel />
      {rows && rows.length > 0 && rows.map((element: IDisplayItem, index: number) => {
        return <ChartItem key={"chartItem" + index} index={index} element={element}
          onDragCapture={(event: React.DragEvent<HTMLSpanElement>) => onDragCapture(event, index)} />
      })}
    </>
  );
}

export default Chart;


const Text = styled.p`
  transform: rotate(270deg);
  position: absolute;
  top: 300px;
  left: -100px;
`

const StyledCanvas = styled.canvas`
border: 2px solid ${ColorCodes.DARK_GREY} }
`