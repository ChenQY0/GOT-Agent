/* eslint-disable react/prop-types */
import React from 'react';

function TipInfo(props) {

    return (
      <div className="tip-info">
          <div className="tip-info-title">
            {props.title}
          </div>
          <div className="tip-info-cont">
            {props.description}
          </div>
      </div>
    );
}

export default TipInfo;