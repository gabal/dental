import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Calendar, Button } from 'antd';
import moment from 'moment';
import AppointmentModal from './AppointmentModal';
import CalendarDay from './CalendarDay';
import './DentalCalendar.scss';

const DentalCalendar = () => {
    const [isAppointmentWindowOpen, setAppointmentWindowOpen] = useState(false);
    const [formRef, setFormRef] = useState(null);
    const [drawerDate, setDrawerDate] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [dentalData, updateAppointments] = useState({});

    
    const drawerStyle = {
        header: {
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 1
        },
        body: {
            maxWidth: '100%'
        }
    }
    const dateFormat = 'YYYY-MM-DD';
    const getObjectFromLocalStorageData = () => {
        const data = JSON.parse(localStorage.getItem('dentalData')) || {};
        Object.keys(data).forEach(function(key) {
            let appointment = data[key];
            appointment.date = moment(appointment.date);
        });
        return data;
    }
    useEffect(() => {
        const data = getObjectFromLocalStorageData();
        updateAppointments(data || {});
    }, []);
    const saveData = (dentalData) => {
        localStorage.setItem('dentalData', JSON.stringify(dentalData))
        updateAppointments(dentalData);
    };
    const handleUpdateCreate = () => {
        formRef.validateFields((err, values) => {
            if (err) {
                return;
            }
            if(!values.appointmentId){
                values.appointmentId = moment().unix();
            }
            dentalData[values.appointmentId] = values;
            saveData(dentalData);
            setAppointmentWindowOpen(false);
        });
    };
    const handleDelete = () => {
        formRef.validateFields((err, values) => {
            if(values.appointmentId){
                delete dentalData[values.appointmentId];
                saveData(dentalData);
            }
        });
        setAppointmentWindowOpen(false);
    };

    const setAppointmentData = (data) => {
        formRef.setFieldsValue({ ...data });
    };

    const saveFormRef = useCallback(node => {
        if (node !== null) {
            setFormRef(node);
        }
    }, []);
    const cleanForm = () => {
        formRef.resetFields();
    }
    const handleCancel = () => {
        setAppointmentWindowOpen(false);
    };
    const handleNewApointment = (date) => {
        setAppointmentWindowOpen(true);
        setAppointmentData({
            date: date ? date : moment(),
            appointmentId: '',
            patientName: '',
            dentistName: '',
            startTime: '',
            endTime: ''
        });
    };
    const handleDateSelect = (date) => {
        setDrawerDate(date);
        setDrawerOpen(true);
    };
    const handleAppointmentSelect = (appointment) => {
        setAppointmentData(appointment);
        setAppointmentWindowOpen(true);
    };

    function getListData(date) {
        const dataForTheDay = Object.values(dentalData).filter(appointment => 
            appointment.date.isSame(date, "day")
        ).sort((a, b) => {
            const startTimeA = parseInt(a.startTime.split(":").join(""));
            const startTimeB = parseInt(b.startTime.split(":").join(""));
            return startTimeA > startTimeB ? 1 : startTimeB > startTimeA ? -1 : 0;
        });
        return dataForTheDay || [];
    }

    function dateCellRender(value) {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map(appointment => (
                    <li key={appointment.appointmentId}>
                        {appointment.dentistName[0]} - {appointment.patientName}
                    </li>
                ))}
            </ul>
        );
    }

    
    return (
        <div className="dental-calendar">
            <div className="action-area">
                <Button id="create-new-appointment-button" type="primary" onClick={() => handleNewApointment(null)}>New Appointment</Button>
            </div>
            <Calendar onSelect={handleDateSelect} dateCellRender={dateCellRender} />
            <Drawer
                title={<div><Button>{`${drawerDate ? drawerDate.format('LL') : ''}`}</Button><Button type="primary" onClick={()=>handleNewApointment(drawerDate)}>New Appointment</Button></div>}
                placement="right"
                closable={true}
                visible={drawerOpen}
                onClose={()=>{setDrawerOpen(false)}}
                width={'100%'}
                headerStyle={drawerStyle.header}
                style={drawerStyle.body}
                zIndex={2}
            >
                <CalendarDay data={getListData(drawerDate)} onSelect={handleAppointmentSelect} />
            </Drawer>
            <AppointmentModal ref={saveFormRef} getListData={getListData} afterClose={cleanForm} dateFormat={dateFormat} visible={isAppointmentWindowOpen} onCreate={() => handleUpdateCreate()} onCancel={() => handleCancel()} onDelete={() => handleDelete()} />
        </div>
    );
}

export default DentalCalendar;