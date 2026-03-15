import { Switch } from '@mui/material';

const ToggleSwitch = (props: any) => {
  return (
    <label className="switch me-2">
      <Switch
        checked={props.value}
        onChange={props.onChange}
        inputProps={{ 'aria-label': 'controlled' }}
        onClick={props.onClick}
        disabled={props.disabled}
        sx={{
          width: 46,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: '3px',
            transitionDuration: '200ms',
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#22C55E',
                opacity: 1,
                border: 0,
              },
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 20,
            height: 20,
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 13,
            backgroundColor: '#EF4444',
            opacity: 1,
            transition: 'background-color 200ms',
          },
        }}
      />
    </label>
  );
};

export default ToggleSwitch;
