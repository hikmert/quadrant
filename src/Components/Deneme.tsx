import React, { useMemo, useState, useEffect } from "react";
import { Drag, raise } from "@visx/drag";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { BarStack } from "@visx/shape";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";

export interface Rect {
  id: string;
  x: number;
  y: number;
}

const testArray = [
  {
    id: "1",
    field1: 100,
    field2: 500,
    station: "Station A",
  },
  {
    id: "2",
    field1: 300,
    field2: 300,
    station: "Station B",
  },
  {
    id: "3",
    field1: 300,
    field2: 200,
    station: "Station C",
  },
  {
    id: "4",
    field1: 200,
    field2: 200,
    station: "Station D",
  },
  {
    id: "5",
    field1: 300,
    field2: 200,
    station: "Station E",
  },
];

const colors = ["red", "yellow", "blue", "green"];

export type DragIProps = {
  width: number;
  height: number;
};

export default function DragI({ width, height }: DragIProps) {
  const [draggingItems, setDraggingItems] = useState<any>([]);

  useEffect(() => {
    if (width > 10 && height > 10) setDraggingItems(testArray);
  }, [width, height]);

  const dragend = (
    event: any,
    draggedIndex: number,
    barStacks: any[],
    barStack: any
  ) => {
    const _draggingItems = [...draggingItems];
    const width = barStack.bars[0].width;
    const lastX = event.dx + barStack.bars[draggedIndex].x;
    const onItemBars = barStacks
      .map((i) => i.bars)
      .map((i) =>
        i.filter(
          (j: any) => j.x - width * 0.9 <= lastX && j.x + width * 0.9 >= lastX
        )
      )[0];
    const targetBar = onItemBars[0];

    if (onItemBars.length > 0 && targetBar?.bar?.data) {
      const draggedObject = barStack.bars[draggedIndex].bar.data;
      if (
        targetBar.bar.data[barStack.key] ||
        targetBar.bar.data[barStack.key] === 0
      ) {
        const unique = uniqueID();
        const newFieldKey: string =
          barStack.key.split("_")[0] + "_" + unique + "_" + draggedObject.id;
        _draggingItems.map((item, index) => {
          _draggingItems[index][newFieldKey] =
            index === targetBar.index ? draggedObject[barStack.key] : 0;
        });
        _draggingItems.find((i) => i.id === draggedObject.id)[barStack.key] = 0;
      }

      const emptyKeys: string[] = Object.keys(targetBar.bar.data)
        .map((key) => {
          return _draggingItems.every((a) => a[key] === 0) ? key : null;
        })
        .filter((i) => i != null) as string[];

      _draggingItems.map((item, index) => {
        emptyKeys.map((key) => delete _draggingItems[index][key]);
      });
      console.log("_draggingItems", _draggingItems);
      setDraggingItems([..._draggingItems]);
    }
  };

  function uniqueID() {
    return Math.floor(Math.random() * Date.now());
  }

  const colorScale = useMemo(
    () =>
      scaleOrdinal({
        range: colors,
        domain: testArray.map((d) => d.id),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height]
  );

  const xMax = width;
  const yMax = height;

  if (draggingItems.length === 0 || width < 10) return null;

  const keys = Object.keys(draggingItems[0]).filter(
    (d) => d !== "station" && d !== "label" && d !== "id"
  );

  const getStation = (d: any) => d.station;

  // scales
  const xScale = scaleBand<string>({
    domain: draggingItems.map(getStation),
    padding: 0.4,
  });

  const yScale = scaleLinear<number>({
    domain: [0, 1000],
  });

  xScale.rangeRound([0, xMax]);
  yScale.range([yMax, 0]);

  const getColor = (d: any) => {
    switch (d.key) {
      case "field1":
        return "blue";
      case "field2":
        return "green";
      default:
        if (d.key.split("_")[0] === "field1") return "blue";
        return "green ";
    }
  };

  return (
    <div className="Drag" style={{ touchAction: "none" }}>
      <svg width={width} height={height}>
        <Group left={50} top={-50}>
          <line
            x1={0}
            x2={width}
            y1={250}
            y2={250}
            stroke="red"
            stroke-width="2"
            stroke-dasharray="5,5"
          />

          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="black"
            strokeOpacity={0.1}
            strokeDasharray="4,4"
            strokeWidth={2}
          />
          <AxisLeft
            scale={yScale}
            hideTicks
            tickLabelProps={() => ({
              fill: "#aeaeae",
              fontWeight: 700,
              fontSize: 18,
              textAnchor: "middle",
              verticalAnchor: "middle",
            })}
            tickLength={30} // TODO: this is an ugly hack :)
            strokeWidth={2}
            stroke="#dcdcdc"
            labelOffset={40}
            label="Length (Sec)"
            labelProps={{
              fill: "#aeaeae",
              fontWeight: 700,
              fontSize: 14,
              textAnchor: "middle",
            }}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            hideTicks
            tickLabelProps={() => ({
              fill: "#aeaeae",
              fontWeight: 700,
              fontSize: 18,
              textAnchor: "middle",
            })}
            strokeWidth={2}
            stroke="#dcdcdc"
          />
          <BarStack
            data={draggingItems}
            keys={keys}
            x={getStation}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar, index) => (
                  <Drag
                    key={`drag-${bar.key + bar.y + Math.random()}`}
                    width={width}
                    height={height}
                    x={bar.x}
                    y={bar.y}
                    onDragStart={(event: any) => {}}
                    onDragEnd={(event: any) => {
                      console.log("keys", bar);
                      dragend(event, index, barStacks, barStack);
                    }}
                  >
                    {({
                      dragStart,
                      dragEnd,
                      dragMove,
                      isDragging,
                      x,
                      y,
                      dx,
                      dy,
                    }) =>
                      bar.bar.data[bar.key] != 0 && (
                        <>
                          <path
                            d={`M${bar.x + bar.width / 1.5 / 4},${
                              bar.y + bar.height
                            } v-${bar.height} q0,-5 5,-5 h${
                              bar.width / 1.5
                            } q5,0 5,5 v${bar.height}`}
                            fill={getColor(bar)}
                            transform={`translate(${dx}, ${dy})`}
                            onMouseMove={dragMove}
                            onMouseUp={dragEnd}
                            onMouseDown={dragStart}
                            onTouchStart={dragStart}
                            onTouchMove={dragMove}
                            onTouchEnd={dragEnd}
                          />
                        </>
                      )
                    }
                  </Drag>
                ))
              )
            }
          </BarStack>
        </Group>
      </svg>

      <style>{`
        .Drag {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        svg {
          margin: 1rem 0;
        }
        .deets {
          display: flex;
          flex-direction: row;
          font-size: 12px;
        }
        .deets > div {
          margin: 0.25rem;
        }
      `}</style>
    </div>
  );
}
