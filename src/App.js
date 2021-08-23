
import React, { Component } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

class App extends Component {
  intervalID1;
  intervalID2;
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          type: "category",
          categories: [],
          labels: {
            show: true,
            rotate: -45,
          },
          max: 32,
          tickPlacement: "on",
        },
      },
      series: [
        {
          name: "Bitcoin",
          data: [],
        },
      ],
      responsive : [
        {
          breakpoint : 1000
        }
      ],
      currentrate: "",
      currency: "",
      Crptocurrency: "",
    };
  }

  componentDidMount() {
    this.getData();
    this.getcurrentData();
  }

  componentWillMount() {
    clearTimeout(this.intervalID1);
    clearTimeout(this.intervalID2);
  }
  getcurrentData = () => {
     axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((res) => {
        this.setState({
          currentrate: res.data.bpi.USD.rate,
          currency: res.data.bpi.USD.code,
          Crptocurrency: res.data.chartName,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    this.intervalID1 = setTimeout(this.getcurrentData.bind(this), 4000);
  };

  getData = () => {
    var prices = [];
    var dates = [];
    axios
      .get("https://api.coindesk.com/v1/bpi/historical/close.json?")
      .then((res) => {
        dates = Object.keys(res.data.bpi);
        prices = Object.values(res.data.bpi);

        const newSeries = [];
        this.state.series.map((s) => {
          const data = [...prices  ];
          newSeries.push({ data, name: s.name });
        });

        this.setState({
          series: newSeries,
          options: {
            ...this.state.options,
            labels: dates,
            xaxis: { ...this.state.options.xaxis, categories: dates },
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
      this.intervalID2 = setTimeout(this.getData.bind(this), 5000);
  };

  render() {
    return (
      <>
        <div>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <h4>Bitcoin Price refreshs on every update</h4>
          </div>
          <div
            className="container"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: " 2px solid #2196f3",
                padding: "10px 20px",
                backgroundColor: "#2196f3",
                color: "white",
                fontSize: "bold",
                borderRadius: "10px",
              }}
            >
              {" "}
              <span>Current rate</span>{" "}
              <span>
                {" "}
                {this.state.Crptocurrency} : ${this.state.currentrate}
              </span>{" "}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: " 2px solid #2196f3",
                padding: "10px 30px",
                backgroundColor: "#2196f3",
                color: "white",
                fontSize: "bold",
                borderRadius: "10px",
              }}
            >
              {" "}
              <span>Currency</span>{" "}
              <span style={{ textAlign: "center" }}>{this.state.currency}</span>{" "}
            </div>
          </div>

          <div className="row">
            <div>
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="line"
                width="1500"
                height="500"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
