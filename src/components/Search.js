import React, { Component } from "react";
import "../Search.css";
import axios from "axios";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      result: {},
      loading: false,
      message: "",
    };
  }

  fetchSearchResults = () => {
    const employeesArr = [];
    const searchURL = "https://randomuser.me/api/?results=100&nat=us";

    if (this.cancel) {
      this.cancel.cancel();
    }

    this.cancel = axios.CancelToken.source();

    axios
      .get(searchURL, {
        cancelToken: this.cancel.token,
      })
      .then(({ data }) => {
        const resultNotFound = !data.results.length
          ? "There is no more data"
          : "";

        this.setState({
          result: data.results,
          message: resultNotFound,
          loading: false,
        });
        console.warn(data);
        employeesArr.push(data);
      })
      .catch((err) => {
        if (axios.isCancel(err) || err) {
          this.setState({
            loading: false,
            message: "Failed to fetch the data. Please check network",
          });
        }
      });
    return employeesArr;
  };

  handleOnInputChange = (event) => {
    // Getting the value and name of the input wich triggered the change
    const query = event.target.value;
    this.setState({ query: query, loading: true, message: "" }, () => {
      this.fetchSearchResults();
    });
  };

  renderSearchResult = () => {
    const { result } = this.state;

    if (Object.keys(result).length && result.length) {
      return (
        <div className="results-container">
          {result.map((result) => {
            return (
              <div key={result.cell} className="result-item">
                <h3 className="employee-firstname">{result.name.first}</h3>
                <h3 className="employee-lastname">{result.name.last}</h3>
                <div className="image-wraper">
                <img
                  className="image"
                  src={result.picture.large}
                  alt={`${result.name.first} name`}
                ></img>
                </div>
                <h3 className="employee-email">{result.email}</h3>
              </div>
            );
          })}
        </div>
      );
    }
  };

  render() {
    const { query, message } = this.state;
    return (
      <div className="container">
        {/* {Heading} */}
        <h2 className="heading">Employee Directory</h2>
        {/* Search Input */}
        <label className="search-label" htmlFor="search-input">
          <input
            type="text"
            value={query}
            id="search-input"
            placeholder="Search..."
            onChange={this.handleOnInputChange}
          />
          <i className="fas fa-search search-icon" aria-hidden="true" />
        </label>
        {/* Error */}
        {message && <p className="message">{message}</p>}
        {/* Result */}
        {this.renderSearchResult()}
      </div>
    );
  }
}

export default Search;
