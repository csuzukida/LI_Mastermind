import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Slider, Switch, Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { Logo } from '../components';
import { GameContext } from '../contexts';
import {
  boxStyle,
  digitSliderMarks,
  guessSliderMarks,
  timerSliderMarks,
  minValueSliderMarks,
  maxValueSliderMarks,
} from '../utils';

const settingsBoxStyle = {
  ...boxStyle,
  boxSizing: 'border-box',
  padding: '1.5rem',
  justifyContent: 'center',
};

const Settings = () => {
  const {
    numDigits,
    setNumDigits,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    timerSetting,
    setTimerSetting,
    maxGuesses,
    setMaxGuesses,
    shouldShowTimer,
    setShouldShowTimer,
  } = useContext(GameContext);

  const MINUTE_IN_MILLISECONDS = 60000;
  // hold local state for default reset
  const [localMaxGuesses, setLocalMaxGuesses] = useState<number>(maxGuesses);
  const [localNumDigits, setLocalNumDigits] = useState<number>(numDigits);
  const [localMinValue, setLocalMinValue] = useState<number>(minValue);
  const [localMaxValue, setLocalMaxValue] = useState<number>(maxValue);
  const [localTimer, setLocalTimer] = useState<number>(timerSetting / MINUTE_IN_MILLISECONDS);
  const [showTimerSetting, setShowTimerSetting] = useState(shouldShowTimer);

  const navigate = useNavigate();

  const handleRevertClick = () => {
    setLocalMaxGuesses(10);
    setLocalNumDigits(4);
    setLocalTimer(5);
    setShowTimerSetting(false);
    setLocalMinValue(0);
    setLocalMaxValue(7);
  };

  const handleSaveClick = () => {
    if (localMinValue >= localMaxValue) {
      alert('Minimum value must be less than maximum value');
      return;
    }
    setMaxGuesses(localMaxGuesses);
    setNumDigits(localNumDigits);
    setMinValue(localMinValue);
    setMaxValue(localMaxValue);
    setTimerSetting(localTimer * MINUTE_IN_MILLISECONDS);
    setShouldShowTimer(showTimerSetting);
    navigate(-1);
  };

  return (
    <Box sx={settingsBoxStyle}>
      <Box sx={{ marginTop: '-3rem' }}>
        <Logo />
      </Box>
      <br />
      <Box>
        <Typography>Number of digits in combination: </Typography>
        <Slider
          value={localNumDigits}
          min={3}
          max={10}
          marks={digitSliderMarks}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            setLocalNumDigits(value as number);
          }}
        />
        <Typography>Maximum number of guesses: </Typography>
        <Slider
          value={localMaxGuesses}
          min={1}
          max={20}
          marks={guessSliderMarks}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            setLocalMaxGuesses(value as number);
          }}
        />
        <Typography>Smallest value of any single digit in the combination:</Typography>
        <Slider
          value={localMinValue}
          min={0}
          max={9}
          marks={minValueSliderMarks}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            setLocalMinValue(value as number);
          }}
        />
        <Typography>Highest value of any single digit in the combination: </Typography>
        <Slider
          value={localMaxValue}
          min={1}
          max={9}
          marks={maxValueSliderMarks}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            setLocalMaxValue(value as number);
          }}
        />
        <Typography>Enable Timer?</Typography>
        <Switch
          checked={showTimerSetting}
          onChange={() => setShowTimerSetting(!showTimerSetting)}
        />
        {showTimerSetting && (
          <>
            <Typography>Timer Length: </Typography>
            <Slider
              value={localTimer}
              min={1}
              max={10}
              marks={timerSliderMarks}
              valueLabelDisplay="auto"
              onChange={(e, value) => {
                setLocalTimer(value as number);
              }}
            />
            <br />
            <br />
          </>
        )}
        <br />
        <br />
        <Box>
          <Button sx={{ marginRight: '1rem' }} onClick={handleRevertClick}>
            Revert to default
          </Button>
          <Button onClick={handleSaveClick}>Save Settings</Button>
        </Box>
      </Box>
      <br />
      <br />
      <Typography>Saving settings will generate a new combination!</Typography>
    </Box>
  );
};

export default Settings;
