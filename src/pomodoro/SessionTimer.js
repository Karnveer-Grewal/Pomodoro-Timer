import React from "react";
import { minutesToDuration } from "../utils/duration";
import { secondsToDuration } from "../utils/duration";

function SessionTimer({
  session,
  isTimerRunning,
  focusDuration,
  breakDuration,
}) {
  //jsx for current session
  if (session) {
    return (
      <>
        <div className="col">
          {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
          <h2 data-testid="session-title">
            {session?.label} for{" "}
            {session?.label === "Focusing"
              ? minutesToDuration(focusDuration)
              : minutesToDuration(breakDuration)}{" "}
            minutes
          </h2>
          {/* TODO: Update message below correctly format the time remaining in the current session */}
          <p className="lead" data-testid="session-sub-title">
            {secondsToDuration(session?.timeRemaining)} remaining
          </p>
          <p>{!isTimerRunning ? "PAUSED" : null}</p>
        </div>
      </>
    );
  } else {
    return null;
  }
}

export default SessionTimer;
