import React from "react";

const Event = (props) => {
  return (
    <tbody>
      <tr>
        <td>{props.name} </td>
        <td>
          {props.user} {props.sender}
        </td>
        <td>
          {props.referrer} {props.referral}
        </td>
        <td>{props.tokenType}</td>
        <td>{props.height}</td>
      </tr>
    </tbody>
  );
};

export default Event;
