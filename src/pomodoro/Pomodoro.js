import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import Duration from "./Duration";
import TimerControls from "./TimerControls";
import SessionTimer from "./SessionTimer";
import ProgressBar from "./ProgressBar";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.
  //Set state of focus session duration
  const [focusDuration, setFocusDuration] = useState(25);

  //handled focus duration state for adding time
  const handleAddFocusDuration = () => {
    if (focusDuration < 60) {
      return setFocusDuration(focusDuration + 5);
    }
  };

  //handled focus duration state for subtracting time
  const handleSubtractFocusDuration = () => {
    if (focusDuration > 5) {
      return setFocusDuration(focusDuration - 5);
    }
  };

  //Set state of break session duration
  const [breakDuration, setBreakDuration] = useState(5);

  //handled break duration state for adding time
  const handleAddBreakDuration = () => {
    if (breakDuration < 15) {
      return setBreakDuration(breakDuration + 1);
    }
  };

  //handled break duration state for adding time
  const handleSubtractBreakDuration = () => {
    if (breakDuration > 1) {
      return setBreakDuration(breakDuration - 1);
    }
  };

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(
    () => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  //jsx for full pomodoro timer
  return (
    <div className="pomodoro">
      <div className="row">
        <Duration
          focusDuration={focusDuration}
          handleAddFocusDuration={handleAddFocusDuration}
          handleSubtractFocusDuration={handleSubtractFocusDuration}
          breakDuration={breakDuration}
          handleAddBreakDuration={handleAddBreakDuration}
          handleSubtractBreakDuration={handleSubtractBreakDuration}
          session={session}
        />
      </div>
      <div className="row">
        <TimerControls
          isTimerRunning={isTimerRunning}
          playPause={playPause}
          session={session}
          setSession={setSession}
          setIsTimerRunning={setIsTimerRunning}
        />
      </div>
      <div>
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        <div className="row mb-2">
          <SessionTimer
            session={session}
            isTimerRunning={isTimerRunning}
            focusDuration={focusDuration}
            breakDuration={breakDuration}
          />
        </div>
        <div className="row mb-2">
          <ProgressBar
            session={session}
            focusDuration={focusDuration}
            breakDuration={breakDuration}
          />
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
