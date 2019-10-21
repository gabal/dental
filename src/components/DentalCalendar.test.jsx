import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import DentalCalendar from './DentalCalendar';

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
        ReactDOM.render(<DentalCalendar />, container);
    });
    ReactDOM.unmountComponentAtNode(container);
});