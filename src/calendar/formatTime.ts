import moment from "moment";

const formatTime = (hora: number, zona: number) => {
  const date = moment().hour(hora).utcOffset(zona);

  const timeAR = date.utcOffset(-3).hour();
  const timeCL = date.utcOffset(-4).hour();
  const timePE = date.utcOffset(-5).hour();
  const timeMX = date.utcOffset(-6).hour();

  return `ARGENTINA [UTC-03:00]: **${timeAR}:00**\r
     CHILE [UTC-04:00]: **${timeCL}:00**\r
     PERU [UTC-05:00]: **${timePE}:00**\r
     MEXICO [UTC-06:00]: **${timeMX}:00**`;
};

export default formatTime;
