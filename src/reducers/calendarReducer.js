import { types } from "../types/types";

// {
//     id: 'sedcnslekjdm',
//     title: 'Cumpleaños',
//     start: moment().toDate(),
//     end: moment().add(2, 'hour').toDate(),
//     bgcolor: '#fafafa',
//     user: {
//         _id: 123,
//         name: 'User'
//     }
// }

const initialState = {
    events: [],
    activeEvent: null
};

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.eventSetActive:
            return {
                ...state,
                activeEvent: action.payload
            }
        case types.eventAddNew:
            return {
                ...state,
                events: [...state.events, action.payload]
            }
        case types.eventClearActiveEvent:
            return {
                ...state,
                activeEvent: null
            }
        case types.eventUpdated:
            return {
                ...state,
                events: state.events.map(
                    evt => (evt.id === action.payload.id) ? action.payload : evt
                )
            }
        case types.eventDeleted:
            return {
                ...state,
                events: state.events.filter(
                    evt => (evt.id !== state.activeEvent.id)
                ),
                activeEvent: null
            }
        case types.eventLoaded:
            return {
                ...state,
                events: [...action.payload]
            }
        case types.eventCleanLogout:
            return {
                ...initialState
            }
        default:
            return state;
    }
}