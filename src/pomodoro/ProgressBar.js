import React from "react";

function ProgressBar({ session, focusDuration, breakDuration }) {
  const focusDurationSec = focusDuration * 60;
  const focusDecimal = 1 - session?.timeRemaining / focusDurationSec;
  const focusPercentage = focusDecimal * 100 || 0;
  const breakDurationSec = breakDuration * 60;
  const breakDecimal = 1 - session?.timeRemaining / breakDurationSec;
  const breakPercentage = breakDecimal * 100;

  return (
    <>
      <div className="col">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={
              session?.label === "Focusing" ? focusPercentage : breakPercentage
            } // TODO: Increase aria-valuenow as elapsed time increases
            style={{
              width:
                session?.label === "Focusing"
                  ? focusPercentage + "%"
                  : breakPercentage + "%",
            }} // TODO: Increase width % as elapsed time increases
          />
        </div>
      </div>
    </>
  );
}

export default ProgressBar;
