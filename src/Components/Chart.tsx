import React, { useEffect, useRef } from 'react';
import { CHART_HEIGHT, IDisplayItem, OFFSET_X, OFFSET_Y } from '../App';
import { ColorCodes } from '../misc/ColorCodes';
import { saveToLocalStorage } from '../misc/CommonUtils';
import CustomLabel from './Label';

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
      let ctx = canvasCtxRef.current!;
      const lineWidth = .2
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
  }, []);

  return (<canvas ref={canvasRef} width={CHART_HEIGHT} height={CHART_HEIGHT} style={{ border: `2px solid ${ColorCodes.DARK_GREY}` }}></canvas>
  )
};

function Chart(props: IChart) {
  const rows: IDisplayItem[] | null = props.rows || null;

  const onDragEnd = (event: React.DragEvent<HTMLSpanElement>, index: number) => {  
    event.preventDefault();
    if (rows && event.clientX < CHART_HEIGHT + OFFSET_X && event.clientY < CHART_HEIGHT + OFFSET_Y) {
      rows[index].x = event.clientX  -OFFSET_X;
      rows[index].y = event.clientY  - OFFSET_Y;
      props.setRows([...rows]);
      saveToLocalStorage(rows);
    }
  }

  return (
    <>
      <Canvas />
      <p style={{ transform: "rotate(270deg)", position: "absolute", top: 300, left: -100 }}>Abiliity to execute <span>&#8594;</span></p>
      <p>Completeness of vision <span>&#8594;</span></p>
      <CustomLabel xPosition={60} yPosition={0} label="Challengers" chartLabel />
      <CustomLabel xPosition={280} yPosition={0} label="Leaders" chartLabel />
      <CustomLabel xPosition={50} yPosition={350} label="Niche Players" chartLabel />
      <CustomLabel xPosition={260 } yPosition={350} label="Visionaries" chartLabel />
      {rows && rows.length > 0 && rows.map((element: IDisplayItem, index: number) => {
        return (
          <div key={"container" + index}>
            <span
              draggable="true"
              onDragEnd={(event) => onDragEnd(event, index)}
              key={"dot" + index}
              className='dot'
              style={{
                height: "15px",
                width: "15px",
                position: "absolute",
                borderRadius: "50%",
                display: "inline-block",
                left: element.x,
                top: element.y,
                backgroundColor: ColorCodes.DARK_BLUE,
              }}></span>
            <p style={{ position: "absolute",  fontSize: 13, fontFamily: "sans-serif", left: element.x, top: element.y, color: ColorCodes.DARK_BLUE}}
              key={"dotLabel" + index}>{element.label}</p>
          </div>)
      })}
    </>
  );
}

export default Chart;
