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
    a: 100,
    b: 200,
    station: "A",
  },
  {
    id: "2",
    a: 300,
    b: 200,
    station: "B",
  },
  {
    id: "3",
    a: 200,
    b: 200,
    station: "C",
  },
  {
    id: "4",
    a: 300,
    b: 200,
    station: "D",
  },
];

const colors = [
  "#025aac",
  "#02cff9",
  "#02efff",
  "#03aeed",
  "#0384d7",
  "#edfdff",
  "#ab31ff",
  "#5924d7",
  "#d145ff",
  "#1a02b1",
  "#e582ff",
  "#ff00d4",
  "#270eff",
  "#827ce2",
];

export type DragIProps = {
  width: number;
  height: number;
};

export default function DragI({ width, height }: DragIProps) {
  const [draggingItems, setDraggingItems] = useState<any[]>([]);

  useEffect(() => {
    if (width > 10 && height > 10) setDraggingItems(testArray);
  }, [width, height]);

  const dragStarted = (item: Rect[], index: number) => {
    console.log("drag started", item, index);
    setDraggingItems(raise(draggingItems, index));
  };

  const dragend = (
    event: any,
    index: number,
    barStacks: any[],
    barStack: any,
    station: string
  ) => {
    const width = 114;
    const lastX = event.dx + barStack.bars[index].x;
    const onItem = barStacks
      .map((i) => i.bars)
      .map((i) => i.filter((j: any) => j.x <= lastX && j.x + width >= lastX));

    if (onItem.length > 0) {
      console.log("AA", onItem[0]["0"]?.bar?.data["station"]);

      //draggingItems[index].station = onItem[0].bar.data["station"];
      setDraggingItems([...draggingItems]);
    }
  };

  /*   const dragend = (
    event: any,
    index: number,
    barStacks: any[],
    barStack: any
  ) => {
    // @ts-ignore

    console.log(event, index, barStacks, barStack);

    const width = 114;

    const lastX = event.dx + barStack.bars[index].x;
    const onItem = barStacks
      .map((i) => i.bars)
      .map((i) => i.filter((j: any) => j.x <= lastX && j.x + width >= lastX));
    console.log(onItem);
  }; */
  const onDragMove = (items: Rect[], index: number) => {
    draggingItems[index].x = items[index].x + 1;

    const checkIncludesX = draggingItems.find(
      (item) => item.x + 50 === items[index].x
    );

    if (checkIncludesX && checkIncludesX.id !== items[index].id) {
      draggingItems[index].y = items[index].y + checkIncludesX.y;
      setDraggingItems(raise(draggingItems, index));
    }
  };

  const colorScale = useMemo(
    () =>
      scaleOrdinal({
        range: colors,
        domain: testArray.map((d) => d.station),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height]
  );

  const xMax = width;
  const yMax = height;

  if (draggingItems.length === 0 || width < 10) return null;

  const keys = Object.keys(draggingItems[0]).filter((d) => d !== "station");

  const getStation = (d: any) => d.station;

  // scales
  const dateScale = scaleBand<string>({
    domain: draggingItems.map(getStation),
    padding: 0.2,
  });

  const temperatureScale = scaleLinear<number>({
    domain: [0, 500],
  });

  dateScale.rangeRound([0, xMax]);
  temperatureScale.range([yMax, 0]);

  return (
    <div className="Drag" style={{ touchAction: "none" }}>
      <svg width={width} height={height}>
        <Group left={20} top={10}>
          <GridRows
            scale={temperatureScale}
            width={xMax}
            height={yMax}
            stroke="black"
            strokeOpacity={0.1}
            strokeDasharray="4,4"
            strokeWidth={2}
          />
          <AxisLeft
            scale={temperatureScale}
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
            scale={dateScale}
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
            xScale={dateScale}
            yScale={temperatureScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map(
                  (bar, index) => (
                    console.log(bar),
                    (
                      <Drag
                        key={`drag-${bar.key + bar.y}`}
                        width={width}
                        height={height}
                        x={bar.x}
                        y={bar.y}
                        onDragStart={(event: any) => {
                          console.log("drag start", event);
                        }}
                        onDragEnd={(event: any) => {
                          const CityName = bar.key;
                          dragend(
                            event,
                            index,
                            barStacks,
                            barStack,
                            bar["bar"].data.station
                          );
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
                        }) => (
                          <path
                            d={`M${bar.x + bar.width / 1.5 / 4},${
                              bar.y + bar.height
                            } v-${bar.height} q0,-5 5,-5 h${
                              bar.width / 1.5
                            } q5,0 5,5 v${bar.height}`}
                            fill={isDragging ? "blue" : bar.color}
                            transform={`translate(${dx}, ${dy})`}
                            onMouseMove={dragMove}
                            onMouseUp={dragEnd}
                            onMouseDown={dragStart}
                            onTouchStart={dragStart}
                            onTouchMove={dragMove}
                            onTouchEnd={dragEnd}
                          />
                        )}
                      </Drag>
                    )
                  )
                )
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
