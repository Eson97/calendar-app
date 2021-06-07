import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/calendar-messages-es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es-mx'
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';



moment.locale('es-mx');
const localizer = momentLocalizer(moment);


export const CalendarScreen = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { uid } = useSelector(state => state.auth);

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    useEffect(() => {
        dispatch(eventStartLoading());
    }, [dispatch])

    const onDoubleCick = () => {
        dispatch(uiOpenModal());
    }

    const onSelect = (e) => {
        dispatch(eventSetActive(e));
        // dispatch(uiOpenModal());
    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        console.log(e);

        //? TODO: agregar creacion de evento mediante doble click?

        dispatch(eventClearActiveEvent());
    }

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: (uid === event.user._id) ? '#DC3545' : '#465660',
            borderRadius: '0px',
            display: 'block',
            color: 'white'
        }
        return {
            style
        }
    }


    return (
        <div className=".calendar-screen">
            <Navbar />
            <div className="container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    messages={messages}
                    eventPropGetter={eventStyleGetter}
                    onDoubleClickEvent={onDoubleCick}
                    onSelectEvent={onSelect}
                    onSelectSlot={onSelectSlot}
                    selectable={true}
                    onView={onViewChange}
                    view={lastView}
                    components={{
                        event: CalendarEvent
                    }}
                />
            </div>
            <AddNewFab />
            { activeEvent && <DeleteEventFab />}
            <CalendarModal />
        </div>
    )
}
