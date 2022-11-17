import React, { BaseSyntheticEvent } from "react";
import { BarStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import cityTemperature, {
  CityTemperature,
} from "@visx/mock-data/lib/mocks/cityTemperature";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
//@ts-ignore
import { timeParse, timeFormat } from "d3-time-format";
//@ts-ignore
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal, LegendLabel, LegendItem } from "@visx/legend";
import { Drag, raise } from "@visx/drag";

type CityName = "New York" | "San Francisco" | "Austin";

type TooltipData = {
  bar: SeriesPoint<CityTemperature>;
  key: CityName;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarStackProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

const green1 = "#0b2345";
const green2 = "#135865";
const green3 = "#3a956c";
export const background = "#fff";
const legendGlyphSize = 20;
const defaultMargin = { top: 20, right: 100, bottom: 100, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(255,255,255,1)",
  color: "#414243",
  fontSize: 18,
};

const data = cityTemperature.slice(0, 8);
const keys = Object.keys(data[0]).filter((d) => d !== "date") as CityName[];

const verticalTickAmount = 5;

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%Y");
const formatDate = (date: string) => format(parseDate(date) as Date);

// accessors
const getDate = (d: CityTemperature) => d.date;

// scales
const dateScale = scaleBand<string>({
  domain: data.map(getDate),
  padding: 0.2,
});
const temperatureScale = scaleLinear<number>({
  domain: [0, 250],
  nice: true,
});
const colorScale = scaleOrdinal<CityName, string>({
  domain: keys,
  range: [green1, green2, green3],
});

let tooltipTimeout: number;

export default function Example({
  width,
  height,
  events = false,
  margin = defaultMargin,
}: BarStackProps) {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  const chartRef = React.useRef<any>(null);

  if (width < 50) return null;
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  dateScale.rangeRound([0, xMax]);
  temperatureScale.range([yMax, 0]);

  const dragend = (
    event: any,
    index: number,
    barStacks: any[],
    barStack: any
  ) => {
    // @ts-ignore

    //  console.log(event, index, barStacks, barStack);

    const width = 48;

    const lastX = event.dx + barStack.bars[index].x;
    const onItem = barStacks
      .map((i) => i.bars)
      .map((i) => i.filter((j: any) => j.x <= lastX && j.x + width >= lastX));
    console.log(onItem);
  };

  return (
    // relative position is needed for correct tooltip positioning
    <div style={{ position: "relative" }} ref={chartRef}>
      <svg ref={containerRef} width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={temperatureScale}
            width={xMax}
            height={yMax}
            stroke="black"
            strokeOpacity={0.1}
            strokeDasharray="4,4"
            strokeWidth={2}
            numTicks={verticalTickAmount}
          />
          <AxisLeft
            scale={temperatureScale}
            hideTicks
            numTicks={verticalTickAmount}
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
            tickFormat={formatDate}
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
          <BarStack<CityTemperature, CityName>
            data={data}
            keys={keys}
            x={getDate}
            xScale={dateScale}
            yScale={temperatureScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar, index) => (
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
                ))
              )
            }
          </BarStack>
        </Group>
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#414243",
          textTransform: "uppercase",
        }}
      >
        <LegendOrdinal scale={colorScale} direction="row">
          {(labels) =>
            labels.map((label, i) => (
              <LegendItem>
                <svg
                  width={legendGlyphSize}
                  height={legendGlyphSize}
                  style={{ margin: "0 2px 0 20px" }}
                >
                  <circle
                    fill={label.value}
                    r={legendGlyphSize / 2}
                    cx={legendGlyphSize / 2}
                    cy={legendGlyphSize / 2}
                  />
                </svg>
                <LegendLabel align="left" margin="0 8px">
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))
          }
        </LegendOrdinal>
      </div>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong style={{ color: tooltipData.color }}>
              {tooltipData.key}
            </strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]} TJ</div>
          <div>
            <small>{formatDate(getDate(tooltipData.bar.data))}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
