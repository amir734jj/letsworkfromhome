import React, { Component } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { PieChart } from "react-minimal-pie-chart";
import bigCompanies from "big-companies";
import Cookies from "universal-cookie";

import { Button, Form, Container, Row, Col, Table } from "react-bootstrap";

import "react-select-search/style.css";

const cookies = new Cookies();

const OPTIONS = Array.from(new Set(bigCompanies
  .map(({ name }) => ({ name, value: name }))
  .concat([
    { name: "Amazon.com", value: "Amazon.com" },
    { name: "Netflix", value: "Netflix" },
    { name: "Other", value: "Other " }
  ])));

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
      .then(() => {
        this.statistics();
        cookies.set("voted", true, { path: "/" });
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  render() {
    const voted = cookies.get("voted") || false;
    const workingFromHome = this.state.results.filter((x) => x.answer);
    const workingFromOffice = this.state.results.filter((x) => !x.answer);

    const counts = this.state.results.reduce((memo, result) => {
      if (!memo[result.company]) {
        memo[result.company] = {
          home: 0,
          office: 0
        }
      }
      memo[result.company][result.answer ? 'home' : 'office']++
      return memo
    }, {})

    return (
      <Container fluid className="mt-5">
        <Row>
          <Col>
            <h3>Do you prefer working from home after the pandemic</h3>
            <p>
              As we are getting close to the end of the pandemic, do you prefer
              working from home or you would like to get back to the office
            </p>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            {voted ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Prefer WFH</th>
                    <th>Prefer Office</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(counts).map((company) => (
                    <tr key={company}>
                      <td>{company}</td>
                      <td>{counts[company].home}</td>
                      <td>{counts[company].office}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
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
            )}
          </Col>
          <Col sm={4}>
            {this.state.results.length ? (
              <div style={{ maxHeight: '25rem' }}>
                <PieChart
                label={(props) => {
                  return props.dataEntry.title;
                }}
                data={[
                  {
                    title: `WFH`,
                    value: workingFromHome.length,
                    color: "lightgreen",
                  },
                  {
                    title: `Office`,
                    value: workingFromOffice.length,
                    color: "lightsalmon",
                  },
                ]}
              />
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    );
  }
}
