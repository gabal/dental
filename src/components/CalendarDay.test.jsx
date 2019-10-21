import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import CalendarDay from './CalendarDay';

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
    const data=[];
    act(() => {
        ReactDOM.render(<CalendarDay data={data} />, container);
    });
    ReactDOM.unmountComponentAtNode(container);
});
