import { Axis } from "@visx/axis";
import { curveNatural } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { MarkerCircle } from "@visx/marker";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Text } from "@visx/text";
import { Component } from "react";
import dataset from "./data.json";
import "../App.css";

const height = 550;
const width = 1000;
const padding = 55;

const xScale = scaleLinear({
  domain: [0, 230],
  range: [0 + padding, width - padding],
});

const yScale = scaleLinear({
  domain: [0, 100],
  range: [height - padding, padding * 2],
});

const xScaleIndv = scaleLinear({
  domain: [0, 5],
  range: [0 + padding, width - padding],
});

const yScaleIndv = scaleLinear({
  domain: [0, 20],
  range: [height - padding, padding * 2],
});

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const colors = {
  white: "#FFFFFF",
  black: "#1B1B1B",
  gray: "#98A7C0",
  darkGray: "#2A2A2A",
  accent: "#40FEAE",
  darkAccent: "#256769",
};

const getMonth = (str) => {
  if (str) {
    let month = str.substring(5, 7);
    return month;
  }
};

const getMonthIndv = (str) => {
  if (str) {
    let date = str.substring(8);
    let month = str.substring(5, 7);
    let year = str.substring(0, 4);
    return date + "/" + month + "/" + year;
  }
};

class Graph1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      date_data: [],
      indv_data: [],
      indv_date_data: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = { ...prevState };
    let temp_data = {};
    let tindv_data = [];
    let tindv_date_data = [];
    dataset.forEach((val) => {
      if (val.item_date === nextProps.date) {
        let schedule_date = val.schedule_time.substring(0, 10);
        temp_data[schedule_date] = {
          count: 0,
          orders: [],
        };
      }
    });
    dataset.forEach((val) => {
      if (val.item_date === nextProps.date) {
        let schedule_date = val.schedule_time.substring(0, 10);
        let schedule_time = val.schedule_time.substring(11);
        temp_data[schedule_date].count++;
        temp_data[schedule_date].orders.push(schedule_time);
      }
    });
    Object.keys(temp_data).forEach((val, ind) => {
      tindv_data.push([ind, temp_data[val].count]);
      tindv_date_data.push(val);
    });
    temp_state["indv_data"] = tindv_data;
    temp_state["indv_date_data"] = tindv_date_data;
    return temp_state;
  }

  componentDidMount() {
    let aggr = {};
    dataset.forEach((val) => {
      aggr[val.item_date] = {
        count: 0,
        bookings: [],
      };
    });
    dataset.forEach((val) => {
      aggr[val.item_date].bookings.push({
        schedule_time: val.schedule_time,
        slot: val.slot,
      });
      aggr[val.item_date].count++;
    });
    let tdata = [];
    let pdata = [];
    Object.keys(aggr).forEach((val, ind) => {
      tdata.push([ind, aggr[val].count]);
      pdata.push(val);
    });
    for (let i = 0; i < 100; i++) {
      pdata.push(pdata.slice(-1)[0]);
    }
    this.setState({
      data: tdata,
      date_data: pdata,
    });
  }

  render() {
    return (
      <div key={this.props.date}>
        {this.props.date === "2030-08-18" ? (
          <svg height={height} width={width}>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              style={{
                fill: colors.black,
              }}
              rx={14}
            />

            <Axis
              scale={xScale}
              top={height - padding}
              orientation="bottom"
              stroke={colors.darkGray}
              strokeWidth={1.5}
              tickStroke={colors.darkGray}
              tickLabelProps={() => ({
                fill: colors.gray,
                textAnchor: "middle",
                verticalAnchor: "middle",
              })}
              tickFormat={(value) => {
                return months[
                  parseInt(getMonth(this.state.date_data[value])) - 1
                ];
              }}
            />

            <Axis
              hideZero
              label="X-axis"
              scale={yScale}
              numTicks={5}
              left={padding}
              orientation="left"
              stroke={colors.darkGray}
              strokeWidth={1.5}
              tickStroke={colors.darkGray}
              tickLabelProps={() => ({
                fill: colors.gray,
                textAnchor: "end",
                verticalAnchor: "middle",
              })}
              tickFormat={(value) => `${value}`}
            />

            <LinearGradient
              id="background-gradient"
              from={colors.darkAccent}
              to={colors.black}
            />

            <LinePath
              data={this.state.data}
              x={(d) => xScale(d[0])}
              y={(d) => yScale(d[1])}
              fill="url('#background-gradient')"
              curve={curveNatural}
            />

            <LinearGradient
              id="line-gradient"
              from={colors.accent}
              to={colors.darkAccent}
            />
            <MarkerCircle
              id="marker-circle"
              fill={colors.gray}
              size={1.5}
              refX={2}
            />

            <LinePath
              data={this.state.data}
              x={(d) => xScale(d[0])}
              y={(d) => yScale(d[1])}
              stroke="url('#line-gradient')"
              strokeWidth={3}
              curve={curveNatural}
              markerEnd="url(#marker-circle)"
            />

            <Text
              style={{
                fill: colors.white,
                fontSize: 24,
                fontWeight: 600,
              }}
              x={padding / 2}
              y={padding}
            >
              Month vs Number of orders (2021 - 22) (Select a date ex :
              02/07/2021)
            </Text>
          </svg>
        ) : (
          <svg height={height} width={width}>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              style={{
                fill: colors.black,
              }}
              rx={14}
            />

            <Axis
              scale={xScaleIndv}
              top={height - padding}
              orientation="bottom"
              stroke={colors.darkGray}
              strokeWidth={1.5}
              tickStroke={colors.darkGray}
              tickLabelProps={() => ({
                fill: colors.gray,
                textAnchor: "middle",
                verticalAnchor: "middle",
              })}
              tickFormat={(value) => {
                return getMonthIndv(this.state.indv_date_data[value]);
              }}
            />

            <Axis
              hideZero
              label="X-axis"
              scale={yScaleIndv}
              numTicks={5}
              left={padding}
              orientation="left"
              stroke={colors.darkGray}
              strokeWidth={1.5}
              tickStroke={colors.darkGray}
              tickLabelProps={() => ({
                fill: colors.gray,
                textAnchor: "end",
                verticalAnchor: "middle",
              })}
              tickFormat={(value) => `${value}`}
            />

            <LinearGradient
              id="background-gradient"
              from={colors.darkAccent}
              to={colors.black}
            />

            <LinePath
              data={this.state.indv_data}
              x={(d) => xScaleIndv(d[0])}
              y={(d) => yScaleIndv(d[1])}
              fill="url('#background-gradient')"
              curve={curveNatural}
            />

            <LinearGradient
              id="line-gradient"
              from={colors.accent}
              to={colors.darkAccent}
            />
            <MarkerCircle
              id="marker-circle"
              fill={colors.gray}
              size={1.5}
              refX={2}
            />

            <LinePath
              data={this.state.indv_data}
              x={(d) => xScaleIndv(d[0])}
              y={(d) => yScaleIndv(d[1])}
              stroke="url('#line-gradient')"
              strokeWidth={3}
              curve={curveNatural}
              markerEnd="url(#marker-circle)"
            />

            <Text
              style={{
                fill: colors.white,
                fontSize: 24,
                fontWeight: 600,
              }}
              x={padding / 2}
              y={padding}
            >
              Date vs Orders
            </Text>
          </svg>
        )}
      </div>
    );
  }
}

export default Graph1;
