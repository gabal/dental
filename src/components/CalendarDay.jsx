import React from "react";
import "./CalendarDay.scss";
import Utilities from '../utilities';
const workTimes = [
    {value:'7:00', label:'07:00am'},
    {value:'7:30', label:'07:30am'},
    {value:'8:00', label:'08:00am'},
    {value:'8:30', label:'08:30am'},
    {value:'9:00', label:'09:00am'},
    {value:'9:30', label:'09:30am'},
    {value:'10:00', label:'10:00am'},
    {value:'10:30', label:'10:30am'},
    {value:'11:00', label:'11:00am'},
    {value:'11:30', label:'11:30am'},
    {value:'12:00', label:'12:00pm'},
    {value:'12:30', label:'12:30pm'},
    {value:'13:00', label:'01:00pm'},
    {value:'13:30', label:'01:30pm'},
    {value:'14:00', label:'02:00pm'},
    {value:'14:30', label:'02:30pm'},
    {value:'15:00', label:'03:00pm'},
    {value:'15:30', label:'03:30pm'},
    {value:'16:00', label:'04:00pm'},
    {value:'16:30', label:'04:30pm'},
    {value:'17:00', label:'05:00pm'},
    {value:'17:30', label:'05:30pm'},
    {value:'18:00', label:'06:00pm'},
    {value:'18:30', label:'06:30pm'},
    {value:'19:00', label:'07:00pm'},
    {value:'19:30', label:'07:30pm'},
    {value:'20:00', label:'08:00pm'},
    {value:'20:30', label:'08:30pm'}
];
const CalendarDay = ({ ...props }) => {
    const heightOf1Hour = 49;
    const initialTime = 700;
    let styles = {

    };
    const expandAppoitnment = (currentAppId, iColumn, columns) => {
        let colSpan = 1;
        let currentStyles = styles[currentAppId];
        for (let i = iColumn + 1; i < columns.length; i++){
            let col = columns[i];
            for (let j = 0; j < col.length; j++){
                let itemStyles = styles[col[j]];
                if (collidesWith(currentStyles, itemStyles)){
                    return colSpan;
                }
            }
            colSpan++;
        }
        return colSpan;
    }

  

    const collidesWith = (a, b) => {
        return getBottom(a) > getTop(b) && getTop(a) < getBottom(b);
    }
    const pack = (columns, blockWidth) => {
        let n = columns.length;
        columns.forEach((col, index) => {
            col.forEach(currentAppId => {
                let colSpan = expandAppoitnment(currentAppId, index, columns);
                styles[currentAppId].left = (index / n)*100 + '%';
                styles[currentAppId].width = (blockWidth * colSpan / n)+'%';
            });
        });
    }
    const getTop = (style) => {
        return parseInt(style.top.split("px").join(""));
    }
    const getBottom = (style) => {
        const top = getTop(style);
        const height = parseInt(style.height.split("px").join(""));
        return top+height;
    }
    const calculateStyles = (appointment) => {
        let styles = {};
        const startTime = Utilities.timeStringToPositionNumber(appointment.startTime);
        const endTime = Utilities.timeStringToPositionNumber(appointment.endTime);
        styles.height = ((endTime - startTime)*heightOf1Hour/100)+'px';
        styles.top = ((startTime - initialTime)*heightOf1Hour/100)+'px';
        return styles;
    }
    let tempSortedAppoinments = [];
    props.data.forEach(appointment => {
        styles[appointment.appointmentId] = calculateStyles(appointment);
        tempSortedAppoinments.push(appointment.appointmentId);
    });
    tempSortedAppoinments = tempSortedAppoinments.sort(function(a1,a2) {
        const a1Styles = styles[a1];
        const a2Styles = styles[a2];
        if (getTop(a1Styles) < getTop(a2Styles)) return -1;
        if (getTop(a1Styles) > getTop(a2Styles)) return 1;
        if (getBottom(a1Styles) < getBottom(a2Styles)) return -1;
        if (getBottom(a1Styles) > getBottom(a2Styles)) return 1;
        return 0;
    });
    let lastAppoinmentEnding = null;
    let columns = [];
    let blockWidth = 100;
    tempSortedAppoinments.forEach(appointmentId => {
        let currentEventStyles = styles[appointmentId];
        if (lastAppoinmentEnding !== null && getTop(currentEventStyles) >= lastAppoinmentEnding) {
            pack(columns, blockWidth);
            columns = [];
            lastAppoinmentEnding = null;
        }
        let placed = false;
        for (var i = 0; i < columns.length; i++) {                   
            var col = columns[i];
            if (!collidesWith( styles[col[col.length-1]], currentEventStyles ) ) {
                col.push(appointmentId);
                placed = true;
                break;
            }
        }
        if (!placed) {
            columns.push([appointmentId]);
        }
        if (lastAppoinmentEnding === null || getBottom(currentEventStyles) > lastAppoinmentEnding) {
            lastAppoinmentEnding = getBottom(currentEventStyles);
        }
    });
    if (columns.length > 0) {
        pack(columns, blockWidth);
    }
  
  
    return (
        <div className="calendar-day">
            {workTimes.filter((item, key) => key%2===0).map((item, key) => <div key={key} className='time-line'><span>{item.label.split(':00').join(' ')}</span></div>)}
            <div className="calendar-appoinments-container">
                {props.data && props.data.map((appointment, key) => {
                    return (
                        <div title={`${appointment.dentistName} - ${appointment.patientName}`} key={key} className='appointment' style={styles[appointment.appointmentId]} onClick={() =>props.onSelect(appointment)}>
                            <div>Dentist: {appointment.dentistName}</div>
                            <div>Patient: {appointment.patientName}</div>
                        </div>
                    )
                })
                }
            </div>
            
        </div>
    );
};
CalendarDay.workTimes = workTimes;
export default CalendarDay;