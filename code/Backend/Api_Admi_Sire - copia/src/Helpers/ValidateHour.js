export const validateTimeFormat = (timeString) => {
    const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]-([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeFormat.test(timeString);
}


