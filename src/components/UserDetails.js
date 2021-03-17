import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const UserDetails = ({ age, postcode, status }) => {
  return (
    <div>
      <Card style={{ width: "40rem" }}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <b>{status === "true" ? "ALLOW ENTRY" : "NO ENTRY"}</b>
          </ListGroup.Item>
          <ListGroup.Item>{typeof age === "undefined" ? "user not found" : age === "0" ? "user not found" : age + " years old"}</ListGroup.Item>
          <ListGroup.Item>{typeof age === "undefined" ? "user not found" : age === "0" ? "user not found" : postcode}</ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default UserDetails;
