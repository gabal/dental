import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import AppointmentModal from './AppointmentModal';

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

it('renders without crashing', () => {
    act(() => {
        ReactDOM.render(<AppointmentModal />, container);
    });
    ReactDOM.unmountComponentAtNode(container);
});


it('it initializes with empty fields', () => {
    const onSubmitFn = jest.fn();
    act(() => {
        ReactDOM.render(<AppointmentModal dateFormat='YYYY-MM-DD' visible={true} onCreate={onSubmitFn} />, container);
    });
    const dentistNameInput = document.querySelector('#dentistName input');
    const patientNameInput = document.querySelector('#patientName input');
    const dateSelect = document.querySelector('#date input');
    const startTimeSelect = document.querySelector('#startTime');
    const endTimeSelect = document.querySelector('#endTime');
    const submitButton = document.querySelector('.ant-modal-footer .ant-btn.ant-btn-primary'); 
    expect(dentistNameInput.value).toBe('');
    expect(patientNameInput.value).toBe('');
    expect(dateSelect.value).toBe('');
    expect(startTimeSelect.textContent).toBe('Start time');
    expect(endTimeSelect.textContent).toBe('End time');
});
/*
TODO
it('it show errors when empty fields', () => {
});
it('it disables end times in the past of start times', () => {
});
it('it saves dentist appoinments and prevents new appoinments at the same times', () => {
});
*/