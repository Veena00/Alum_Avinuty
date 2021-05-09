import React from "react";
import { Form, Button, Message, TextArea, Divider } from "semantic-ui-react";

function CommonInputs({
  user: { registration_number, bio },
  handleChange,
  showRegNo,
  setShowRegNo,
}) {
  return (
    <>
      <Form.Field
        style={{ marginTop: "10px" }}
        control={TextArea}
        name="bio"
        value={bio}
        label="Tell us about Yourself"
        onChange={handleChange}
        placeholder="Add Bio"
      />
      <Button
        content="Add Registration number"
        color="red"
        icon="slack hash"
        type="button"
        onClick={() => setShowRegNo(!showRegNo)}
      />

      {showRegNo && (
        <>
          <Divider />
          <Form.Input
            icon="hashtag"
            iconPosition="left"
            name="registration_number"
            value={registration_number}
            onChange={handleChange}
          />

          <Message
            icon="attention"
            info
            size="small"
            header="Registration number for Alumni is optional"
          />
        </>
      )}
    </>
  );
}

export default CommonInputs;
