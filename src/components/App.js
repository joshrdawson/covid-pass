import { Tabs, Tab, Form } from "react-bootstrap";
import Passport from "../contracts/Passport.json";
import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import UserDetails from "./UserDetails.js";

function verifyUserDetails(name, NHSNumber, age, subdivisionCode, status) {
  try {
    // check entered between 1-3 names (forename, middlename, surname)
    var names = name.split(" ");
    if (names.length > 3) {
      throw "Invalid name!";
    }

    // check entered valid NHS Number (3 digits, followed by 3 digits, followed by 4 digits)
    var NHSRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    var checkNHS = NHSNumber.match(NHSRegex);
    if (checkNHS === null) {
      throw "Invalid NHSNumber!";
    }
    NHSNumber = checkNHS[0];

    // check age is a valid age (1-120)
    if (age < 1 || age > 120) {
      throw "Invalid Age!";
    }

    // check subdivision code
    var subdivisionRegex = /\bGB-[A-Z]{3}/;
    var checkSubdivision = subdivisionCode.match(subdivisionRegex);
    if (checkSubdivision === null) {
      throw "Invalid subdivision code!";
    }
    subdivisionCode = checkSubdivision[0];
    return true;
  } catch (e) {
    console.log("error: ", e);
    window.alert("Error adding user");
    return false;
  }
}

class App extends Component {
  async componentDidMount() {
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    //check if MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      const networkID = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts();

      //assign to values to variables: web3, netId, accounts
      if (typeof accounts[0] !== "undefined") {
        let balance = await web3.eth.getBalance(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");
        this.setState({ web3: web3, account: accounts[0], balance: balance });
      } else {
        window.alert("Please login with MetaMask");
      }

      try {
        const passport = new web3.eth.Contract(Passport.abi, Passport.networks[networkID].address);
        this.setState({ passport: passport });
        this.setVerifiedStatus();
      } catch (e) {
        console.log("error: ", e);
        window.alert("Contract not deployed to the current network");
      }
    } else {
      window.alert("Please use a browser with MetaMask");
    }
  }

  async setVerifiedStatus() {
    if (this.state.passport !== "undefined") {
      try {
        const s = await this.state.passport.methods.isVerified(this.state.account).call({ from: this.state.account });
        this.setState({ verified: s });
      } catch (e) {
        console.log("Get error: ", e);
        this.setState({ verified: false });
      }
    }
  }

  async getUserDetails(h) {
    if (this.state.passport !== "undefined") {
      try {
        const u = await this.state.passport.methods.passports(h).call({ from: this.state.account });
        this.setState({ age: u.age, status: u.immunity.toString(), subdivisionCode: u.subdivisionCode });
      } catch (e) {
        console.log("Get error: ", e);
        this.setState({ verified: false });
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: "undefined",
      passport: "undefinied",
      account: "undefined",
      balance: 0,
      verified: false,
      user: {
        age: "undefined",
        subdivisionCode: "undefined",
        status: "undefined",
      },
    };
  }

  render() {
    if (this.state.verified) {
      return (
        <div className="text-monospace">
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <b className="title">covid-pass Health Organisation AP</b>
          </nav>
          <div className="container-fluid mt-5 text-center">
            <br />
            <h2>{this.state.account}</h2>
            <br />
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="set" title="Add Citizen">
                      <div>
                        <br />
                        <h4>
                          <b>DETAILS:</b>
                        </h4>
                        <br />
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            let name = this.userName.value;
                            let NHSNumber = this.userNHSNumber.value;
                            let age = this.userAge.value;
                            let subdivisionCode = this.userSubdivisionCode.value;
                            let status = this.userStatus.value;
                            if (verifyUserDetails(name, NHSNumber, age, subdivisionCode, status)) {
                              console.log("PASS");
                            }
                          }}
                        >
                          <Form.Group controlId="userName">
                            <Form.Label>NAME</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="name"
                              ref={(input) => {
                                this.userName = input;
                              }}
                            />
                          </Form.Group>

                          <Form.Group controlId="userNHSNumber">
                            <Form.Label>NHS NUMBER</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="000-000-0000"
                              ref={(input) => {
                                this.userNHSNumber = input;
                              }}
                            />
                          </Form.Group>

                          <Form.Group controlId="userAge">
                            <Form.Label>AGE</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="age"
                              ref={(input) => {
                                this.userAge = input;
                              }}
                            />
                          </Form.Group>

                          <Form.Group controlId="userSubdivisionCode">
                            <Form.Label>SUBDIVISION CODE</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="ENG-LDN"
                              ref={(input) => {
                                this.userSubdivisionCode = input;
                              }}
                            />
                          </Form.Group>

                          <Form.Group controlId="userStatus">
                            <Form.Label>COVID IMMUNITY STATUS</Form.Label>
                            <Form.Control
                              as="select"
                              ref={(input) => {
                                this.userStatus = input;
                              }}
                            >
                              <option>IMMUNE</option>
                              <option>NON-IMMUNE</option>
                            </Form.Control>
                          </Form.Group>

                          <button type="submit" className="btn btn-primary">
                            SUBMIT
                          </button>
                        </form>
                      </div>
                    </Tab>

                    <Tab eventKey="get" title="Account Details">
                      <div>
                        <br />
                        <p>Balance: {this.state.balance} ETH</p>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-monospace">
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <b className="title">covid-pass Bussiness AP</b>
          </nav>
          <div className="container-fluid mt-5 text-center">
            <br />
            <h2>{this.state.account}</h2>
            <br />
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="set" title="Check User">
                      <div>
                        <br />
                        Enter hash:
                        <br />
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            let hash = this.hash.value;
                            this.getUserDetails(hash);
                          }}
                        >
                          <div className="form-group mr-sm-2">
                            <br />
                            <input
                              id="hash"
                              type="text"
                              className="form-control form-control-md"
                              placeholder="hash..."
                              required
                              ref={(input) => {
                                this.hash = input;
                              }}
                            />
                          </div>
                          <button type="submit" className="btn btn-primary">
                            SUBMIT
                          </button>
                        </form>
                        <br />
                        <UserDetails age={this.state.age} subdivisionCode={this.state.subdivisionCode} status={this.state.status} />
                      </div>
                    </Tab>

                    <Tab eventKey="get" title="Account Details">
                      <div>
                        <br />
                        <p>Balance: {this.state.balance} ETH</p>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
