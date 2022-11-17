import React, { useMemo, useState, useEffect } from "react";
import { scaleOrdinal } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { Drag, raise } from "@visx/drag";

export interface Rect {
  id: string;
  x: number;
  y: number;
}

const testArray = [
  {
    id: "1",
    x: 100,
    y: 200,
  },
  {
    id: "2",
    x: 300,
    y: 200,
  },
  {
    id: "3",
    x: 200,
    y: 200,
  },
  {
    id: "4",
    x: 300,
    y: 200,
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
  const [draggingItems, setDraggingItems] = useState<Rect[]>([]);

  useEffect(() => {
    if (width > 10 && height > 10) setDraggingItems(testArray);
  }, [width, height]);

  const dragStarted = (item: Rect[], index: number) => {
    console.log("drag started", item, index);
    setDraggingItems(raise(draggingItems, index));
  };

  const onDragEnd = (item: Rect[], index: number) => {
    console.log("drag end");
    /*     draggingItems[index].y = item[index].y - 100;

    setDraggingItems(raise(draggingItems, index)); */
  };
  console.log(draggingItems);
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
        domain: draggingItems.map((d) => d.id),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height]
  );

  if (draggingItems.length === 0 || width < 10) return null;

  return (
    <div className="Drag" style={{ touchAction: "none" }}>
      <svg width={width} height={height}>
        <LinearGradient id="stroke" from="#ff00a5" to="#ffc500" />
        <rect fill="#c4c3cb" width={width} height={height} rx={14} />

        {testArray.map((d, i) => (
          <Drag
            key={`drag-${d.id}`}
            width={width}
            height={height}
            x={d.x}
            y={d.y}
            onDragStart={() => {
              dragStarted(draggingItems, i);
            }}
            onDragMove={() => {
              onDragMove(draggingItems, i);
            }}
            onDragEnd={() => {
              onDragEnd(draggingItems, i);
            }}
          >
            {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
              <rect
                key={`dot-${d.id}`}
                x={d.x}
                y={d.y}
                width={15}
                height={30}
                fill={isDragging ? "url(#stroke)" : colorScale(d.id)}
                transform={`translate(${dx}, ${d.y})`}
                fillOpacity={0.9}
                stroke={isDragging ? "white" : "transparent"}
                strokeWidth={2}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
              />
            )}
          </Drag>
        ))}
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
