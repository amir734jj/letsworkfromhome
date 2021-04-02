import React, { Component } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { PieChart } from "react-minimal-pie-chart";
import bigCompanies from "big-companies";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

import "react-select-search/style.css";

const OPTIONS = bigCompanies
  .map(({ name }) => ({ name, value: name }))
  .concat([{ name: "Other", value: "Other " }]);

export default class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = { company: "Other", vote: true, results: [] };
  }

  componentDidMount() {
    this.statistics();
  }

  statistics = async () => {
    const results = await fetch("api/vote", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    this.setState({ results });
  };

  submit = () => {
    fetch("api/vote", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: this.state.company,
        vote: this.state.vote,
      }),
    })
      .then((response) => response.json())
      .then(this.statistics)
      .catch(function (err) {
        console.log(err);
      });
  };

  render() {
    return (
      <Container fluid className="mt-5">
        <Row>
          <Col>
            <h3>Do you prefer working from home after the pandemic</h3>
            <p>
              As we are getting to the end of the pandemic, do you prefer
              working from home or you would like to get back to the office
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="vote">
                <Form.Label>Working preference</Form.Label>
                <Form.Check
                  type="radio"
                  id="yes"
                  label="Continue to work from home"
                  checked={this.state.vote}
                  onChange={(e) => this.setState({ vote: true })}
                />
                <Form.Check
                  type="radio"
                  id="no"
                  name="vote"
                  label="Go back to the office"
                  checked={!this.state.vote}
                  onChange={(e) => this.setState({ vote: false })}
                />
              </Form.Group>

              <Form.Group controlId="company">
                <Form.Label>Company name</Form.Label>
                <SelectSearch
                  name={this.state.company}
                  value={this.state.company}
                  options={OPTIONS}
                  search
                  filterOptions={fuzzySearch}
                  placeholder="Select your company"
                  onChange={(v) => this.setState({ company: v })}
                />
              </Form.Group>

              <Button onClick={this.submit}> Vote </Button>
            </Form>
          </Col>
          <Col>
            {this.state.results.length ? (
              <PieChart
                label={(props) => {
                  return props.dataEntry.title;
                }}
                data={[
                  {
                    title: "WFH",
                    value: this.state.results.filter((x) => x.answer).length,
                    color: "lightgreen",
                  },
                  {
                    title: "Office",
                    value: this.state.results.filter((x) => !x.answer).length,
                    color: "lightsalmon",
                  },
                ]}
              />
            ) : null}
          </Col>
        </Row>
      </Container>
    );
  }
}
