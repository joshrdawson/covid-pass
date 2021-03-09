import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const UserDetails = ({ age, subdivisionCode, status }) => {
  if (typeof age === "undefined") {
    return (
      <div>
        <Card style={{ width: "40rem" }}>
          <ListGroup variant="flush">
            <ListGroup.Item></ListGroup.Item>
            <ListGroup.Item></ListGroup.Item>
            <ListGroup.Item></ListGroup.Item>
          </ListGroup>
        </Card>
      </div>
    );
  } else {
    return (
      <div>
        <Card style={{ width: "40rem" }}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <b>{status === "true" ? "ALLOW ENTRY" : "NO ENTRY"}</b>
            </ListGroup.Item>
            <ListGroup.Item>{age}</ListGroup.Item>
            <ListGroup.Item>{subdivisionCode}</ListGroup.Item>
          </ListGroup>
        </Card>
      </div>
    );
  }
};

export default UserDetails;
