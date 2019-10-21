import React, { useState, useEffect} from "react";
import { Button, Input, Col, Modal, Form, AutoComplete, DatePicker, Select } from "antd";
import moment from 'moment';
import Utilities from '../utilities';
import CalendarDay from './CalendarDay';
const { Option, OptGroup } = Select;
const ModalFormComponent = ({ ...props }) => {
    const [appointmentValidationInfo, setAppointmentValidationInfo] = useState({});
    const { getFieldDecorator } = props.form;
    const todayDate = moment();
    const formItemLayout = {
        labelCol: {
            sm: { span: 4 },
        },
        wrapperCol: {
            sm: { span: 20 },
        },
    };
    useEffect(() => {
        const values = props.form.getFieldsValue();
        if(values.appointmentId !== appointmentValidationInfo.appointmentId){
            updateData(values);
        }
    });
    const getDoctorAppointmentTimes = (dentistName, date, appointmentId) => {
        if (dentistName) {
            let dataForTheSelectedDate = props.getListData(date);
            let dataForTheCurrentDentist = dataForTheSelectedDate.filter(appointment => appointment.dentistName === dentistName && appointment.appointmentId !== appointmentId).map(appointment=>appointment.startTime);
            return new Set(dataForTheCurrentDentist);
        }
        return new Set();
    }
    const getDisabledTimeLists = (formData) => {
        if (formData.date && formData.date.isBefore(todayDate, "day")) {
            const allTimes = new Set(CalendarDay.workTimes.map(time => time.value));
            return { startTimeDisabledList: allTimes, endTimeDisabledList: allTimes };
        }

        let excludedTimes = new Set([]);
        if (formData.date && formData.date.isSame(todayDate, "day")) {
            const currentTime = moment().format('HHmm');
            excludedTimes = new Set(CalendarDay.workTimes.filter(time => {
                return currentTime >= Utilities.timeStringToNumber(time.value)
            }).map(time => time.value));
        }

        let excludedStartTimes = getDoctorAppointmentTimes(formData.dentistName, formData.date, formData.appointmentId);

        let excludedEndTimes = new Set([]);
        if (formData.startTime) {
            let currentStartTime = Utilities.timeStringToNumber(formData.startTime);
            excludedEndTimes = new Set(CalendarDay.workTimes.filter(time => { return currentStartTime >= Utilities.timeStringToNumber(time.value) }).map(time => time.value));
        }
        return {
            startTimeDisabledList: new Set([...excludedTimes, ...excludedStartTimes]),
            endTimeDisabledList: new Set([...excludedTimes, ...excludedEndTimes])
        };
    }
    const updateAppointmentId = (appointmentId) => {
        console.log('---'+appointmentId);
        updateData({ appointmentId: appointmentId });
    }
    const updateDate = (date) => {
        updateData({ date: date });
    }
    const updateDentistName = (dentistName) => {
        updateData({ dentistName: dentistName });
    }
    const updateStartTime = (startTime) => {
        updateData({ startTime: startTime });
    }
    const updateEndTime = (endTime) => {
        updateData({ endTime: endTime });
    }
    const updateData = (newData) => {
        let newConfig = { ...appointmentValidationInfo, ...newData };
        newConfig = { ...newConfig, ...getDisabledTimeLists(newConfig) };
        setAppointmentValidationInfo(newConfig);
        if (newConfig.startTimeDisabledList && newConfig.startTimeDisabledList.has(newConfig.startTime)) {
            props.form.resetFields(['startTime', 'endTime']);
        } else if (newConfig.endTimeDisabledList && newConfig.endTimeDisabledList.has(newConfig.endTime)) {
            props.form.resetFields(['endTime']);
        }
    }
    const isDisabled = (item, list) => {
        if (list) {
            return list.has(item);
        }
        return false;
    }

   
    const getFooterButtons = () => {
        const footerButtons = [];
        footerButtons.push(<Button key="close" onClick={props.onCancel}>Close</Button>);
        if(appointmentValidationInfo.appointmentId){
            footerButtons.push(<Button key="delete" type="danger" onClick={props.onDelete}>Delete</Button>);
        }
        footerButtons.push(<Button key="submit" type="primary" onClick={props.onCreate}>Save</Button>);
        return footerButtons;
    }
    
    return (
        <Modal
            visible={props.visible}
            title={appointmentValidationInfo.appointmentId ? `Appoinment ${appointmentValidationInfo.appointmentId}` : 'New Appointment'}
            okText="Save"
            onCancel={props.onCancel}
            afterClose={props.afterClose}
            onOk={props.onCreate}
            zIndex = {3}
            footer={getFooterButtons()}
            id="appointment-modal"
        >
            <Form>
                <Form.Item style={{ display: 'none' }}>
                    {getFieldDecorator("appointmentId", {
                    })(<Input onChange={updateAppointmentId} />)}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Dentist">
                    <Col span={24}>
                        {getFieldDecorator("dentistName", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input the dentist name."
                                }
                            ]
                        })(<AutoComplete onBlur={updateDentistName} />)}
                    </Col>
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Patient">
                    <Col span={24}>
                        {getFieldDecorator("patientName", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input the patient name."
                                }
                            ]
                        })(<AutoComplete />)}
                    </Col>
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Time"
                    required={true}>
                    <Col span={8}>
                        <Form.Item>

                            {getFieldDecorator("date", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input the date of the appointment."
                                    }
                                ]
                            })(<DatePicker
                                onChange={updateDate}
                                format={props.dateFormat}
                                disabledDate={current => {
                                    return current && current.isBefore(todayDate, "day");
                                }}
                            />)}
                        </Form.Item>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                        <Form.Item>
                            {getFieldDecorator("startTime", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input the start time."
                                    }
                                ]
                            })(<Select placeholder="Start time" onChange={updateStartTime}>
                                <OptGroup label="Morning">
                                    {CalendarDay.workTimes.filter((item, key) => key < 10).map((item) => <Option key={item.value} disabled={isDisabled(item.value, appointmentValidationInfo.startTimeDisabledList)} value={item.value}>{item.label}</Option>)}
                                </OptGroup>
                                <OptGroup label="Afternoon">
                                    {CalendarDay.workTimes.filter((item, key) => key >= 10).map((item) => <Option key={item.value} disabled={isDisabled(item.value, appointmentValidationInfo.startTimeDisabledList)} value={item.value}>{item.label}</Option>)}
                                </OptGroup>
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={1}><div style={{textAlign:'center'}}>-</div></Col>
                    <Col span={7}>
                        <Form.Item>
                            {getFieldDecorator("endTime", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please input the end time."
                                    }
                                ]
                            })(<Select placeholder="End time" onChange={updateEndTime} >
                                <OptGroup label="Morning">
                                    {CalendarDay.workTimes.filter((item, key) => key < 10).map((item) => <Option key={item.value} disabled={isDisabled(item.value, appointmentValidationInfo.endTimeDisabledList)} value={item.value}>{item.label}</Option>)}
                                </OptGroup>
                                <OptGroup label="Afternoon">
                                    {CalendarDay.workTimes.filter((item, key) => key >= 10).map((item) => <Option key={item.value} disabled={isDisabled(item.value, appointmentValidationInfo.endTimeDisabledList)} value={item.value}>{item.label}</Option>)}
                                </OptGroup>
                            </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const AppointmentModal = Form.create({})(ModalFormComponent);
export default AppointmentModal;