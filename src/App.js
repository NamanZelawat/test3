import React, { Component } from "react";
import Graph1 from "./components/Graph1";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Datepicker from "./components/Datepicker";
import "./App.css";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date("2030-08-18T21:11:54"),
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.convertDateToString = this.convertDateToString.bind(this);
  }

  convertDateToString() {
    let date = this.state.date.getDate().toString();
    let month = (this.state.date.getMonth() + 1).toString();
    let year = this.state.date.getFullYear().toString();
    if (month.length === 1) {
      month = "0" + month;
    }
    if (date.length === 1) {
      date = "0" + date;
    }
    let date_string = year + "-" + month + "-" + date;
    return date_string;
  }

  handleDateChange(newValue) {
    this.setState({
      date: newValue,
    });
  }

  render() {
    return (
      <div className="App">
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Item sx={{ height: "100%" }}>
              <Grid container>
                <Grid item xs={8}>
                  <h1>Mealful task</h1>
                </Grid>
                <Grid item xs={2}>
                  <Datepicker
                    date={this.state.date}
                    change={this.handleDateChange}
                  />
                </Grid>
              </Grid>
              <Graph1 date={this.convertDateToString(this.state.date)} />
            </Item>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
