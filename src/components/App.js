import { Tabs, Tab, Form } from "react-bootstrap";
import Passport from "../contracts/Passport.json";
import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import UserDetails from "./UserDetails.js";
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
        this.getVerifiedStatus();
      } catch (e) {
        console.log("error: ", e);
        window.alert("Contract not deployed to the current network");
      }
    } else {
      window.alert("Please use a browser with MetaMask");
    }
  }

  async getVerifiedStatus() {
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
        this.setState({ age: u.age, status: u.immunity.toString(), postcode: u.postcode });
      } catch (e) {
        console.log("Get error: ", e);
      }
    }
  }

  async addCitizen(name, NHSNumber, age, postcode, status) {
    if (this.state.passport !== "undefined") {
      try {
        let hash = generateHash(NHSNumber, name, age, postcode);
        await this.state.passport.methods.addCitizen("0x" + hash, postcode, age, status).send({ from: this.state.account });
        window.alert("Added " + name + " succsesfully");
      } catch (e) {
        console.log("Get error: ", e);
      }
    }
  }

  async removeCitizen(name, NHSNumber, age, postcode) {
    if (this.state.passport !== "undefined") {
      try {
        let hash = generateHash(NHSNumber, name, age, postcode);
        await this.state.passport.methods.removeCitizen("0x" + hash).send({ from: this.state.account });
        window.alert("Removed " + name + " succsesfully");
      } catch (e) {
        console.log("Get error: ", e);
      }
    }
  }

  async addVerifiedUser(address) {
    if (this.state.passport !== "undefined") {
      try {
        await this.state.passport.methods.addVerifiedUser(address).send({ from: this.state.account });
        window.alert("Added " + address + " succsesfully");
      } catch (e) {
        console.log("Get error: ", e);
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
        postcode: "undefined",
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
                    <Tab eventKey="addCitizen" title="Add Citizen">
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
                            let postcode = this.userPostcode.value;
                            let status = this.userStatus.value === "IMMUNE" ? true : false;
                            if (verifyUserDetails(name, NHSNumber, age, postcode)) {
                              this.addCitizen(name, NHSNumber, age, postcode, status);
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

                          <Form.Group controlId="userPostcode">
                            <Form.Label>POSTCODE</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="NE1 4LP"
                              ref={(input) => {
                                this.userPostcode = input;
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

                    <Tab eventKey="removeCitizen" title="Remove Citizen">
                      <div>
                        <br />
                        <h4>
                          <b>DETAILS:</b>
                        </h4>
                        <br />
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            let name = this.removeUserName.value;
                            let NHSNumber = this.removeUserNHSNumber.value;
                            let age = this.removeUserAge.value;
                            let postcode = this.removeUserPostcode.value;
                            if (verifyUserDetails(name, NHSNumber, age, postcode)) {
                              this.removeCitizen(name, NHSNumber, age, postcode);
                            }
                          }}
                        >
                          <Form.Group controlId="userName">
                            <Form.Label>NAME</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="name"
                              ref={(input) => {
                                this.removeUserName = input;
                              }}
                            />
                          </Form.Group>

                          <Form.Group controlId="userNHSNumber">
                            <Form.Label>NHS NUMBER</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="000-000-0000"
                              ref={(input) => {
                                this.removeUserNHSNumber = input;
                              }}
                            />
                          </Form.Group>

                          <Form.Group controlId="userAge">
                            <Form.Label>AGE</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="age"
                              ref={(input) => {
                                this.removeUserAge = input;
                              }}
                            />
                          </Form.Group>

                          <Form.Group controlId="userPostcode">
                            <Form.Label>POSTCODE</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="NE1 4LP"
                              ref={(input) => {
                                this.removeUserPostcode = input;
                              }}
                            />
                          </Form.Group>

                          <button type="submit" className="btn btn-primary">
                            SUBMIT
                          </button>
                        </form>
                      </div>
                    </Tab>

                    <Tab eventKey="adminTools" title="Administrative Tools">
                      <div>
                        <br />
                        <p>Balance: {this.state.balance} ETH</p>
                        <div>
                          <br />
                          <h4>VERIFY ACCOUNT</h4>
                          <br />
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              let address = this.verifyAddress.value;
                              if (Web3.utils.isAddress(address)) {
                                this.addVerifiedUser(address);
                              }
                            }}
                          >
                            <Form.Group controlId="verifyAddress">
                              <Form.Label>ADDRESS</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="0x......."
                                ref={(input) => {
                                  this.verifyAddress = input;
                                }}
                              />
                            </Form.Group>
                            <button type="submit" className="btn btn-primary">
                              SUBMIT
                            </button>
                          </form>
                        </div>
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
                        <UserDetails age={this.state.age} postcode={this.state.postcode} status={this.state.status} />
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

function generateHash(name, NHSNumber, age, postcode) {
  let createKeccakHash = require("keccak");
  let hash = createKeccakHash("keccak256")
    .update(NHSNumber + name + age + postcode)
    .digest("hex");
  console.log(hash);
  createKeccakHash = null;
  return hash;
}

function verifyUserDetails(name, NHSNumber, age, postcode) {
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

    // check postcode is valid
    var postcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
    var checkPostcode = postcode.match(postcodeRegex);
    if (checkPostcode === null) {
      throw "Invalid postcode!";
    }
    postcode = checkPostcode[0];
    return true;
  } catch (e) {
    console.log("error: ", e);
    window.alert("Error invalid user details: " + e);
    return false;
  }
}

export default App;
