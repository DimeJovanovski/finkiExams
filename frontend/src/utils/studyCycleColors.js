const StudyCycleColors = {
    UNDERGRADUATE: '#0000FF',     // Blue
    MASTER: '#FF0000',            // Red
    PHD: '#00FF00',               // Green
  };
  
  // Function to get the color by study cycle
  export const getColorByStudyCycle = (studyCycle) => {
    return StudyCycleColors[studyCycle] || '#000000'; // Default to black if studyCycle is not found
  };
  