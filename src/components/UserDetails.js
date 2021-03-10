import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const UserDetails = ({ age, subdivisionCode, status }) => {
  if (age === "0") {
    return (
      <div style={{ width: "40rem" }}>
        <p>User not found</p>
      </div>
    );
  }
  return (
    <div>
      <Card style={{ width: "40rem" }}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <b>{typeof age === "undefined" ? "" : status === "true" ? "ALLOW ENTRY" : "NO ENTRY"}</b>
          </ListGroup.Item>
          <ListGroup.Item>{typeof age === "undefined" ? "" : age + " years old"}</ListGroup.Item>
          <ListGroup.Item>{typeof age === "undefined" ? "" : subdivisionCode}</ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default UserDetails;
