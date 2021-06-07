import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdated } from '../../actions/events';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root');

const initialDate = moment().minutes(0).seconds(0);

const initEvent = {
    title: '',
    notes: '',
    start: initialDate.toDate(),
    end: initialDate.add(1, 'hour').toDate()
}

export const CalendarModal = () => {

    const { modalOpen } = useSelector(state => state.ui);
    const { activeEvent } = useSelector(state => state.calendar);
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(initialDate.toDate());
    const [endDate, setEndDate] = useState(initialDate.add(1, 'hour').toDate());
    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState(initEvent)

    const { notes, title, start, end } = formValues;

    useEffect(() => {
        if (activeEvent) {
            setFormValues(activeEvent);
            setStartDate(activeEvent.start)
            setEndDate(activeEvent.end)
        } else {
            setFormValues(initEvent);
        }
    }, [activeEvent, setFormValues]);

    const handleInputChange = ({ target }) => (
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    );

    const handleStartDate = (e) => {
        setStartDate(e);
        setFormValues({
            ...formValues,
            start: e
        })
    }
    const handleEndDate = (e) => {
        setEndDate(e);
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const _start = moment(start);
        const _end = moment(end);

        if (_start.isSameOrAfter(_end)) return Swal.fire('Error', 'La fecha fin debe ser mayo a la fecha de inicio', 'error');

        if (title.trim().length < 2) return setTitleValid(false);

        //TODO: realizar alta en DB

        if (activeEvent !== null) {
            dispatch(eventStartUpdated(formValues));
        } else {
            dispatch(eventStartAddNew(formValues));
        }

        setTitleValid(true);
        closeModal();
    }

    const closeModal = () => {
        dispatch(uiCloseModal());
        dispatch(eventClearActiveEvent());
        setFormValues(initEvent)
    }

    return (
        <Modal
            isOpen={modalOpen}
            //   onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
            className="modal"
            overlayClassName="modal-fondo"
        >
            <h1> {activeEvent ? "Editar evento" : "Nuevo evento"} </h1>
            <hr />
            <form className="container" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={handleStartDate}
                        value={startDate}
                        className="form-control"
                        format="dd/MM/yyyy - HH:mm"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={handleEndDate}
                        value={endDate}
                        className="form-control"
                        format="dd/MM/yyyy - HH:mm"
                        minDate={startDate}
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${!titleValid && 'is-invalid'}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-outline-primary">
                        <i className="far fa-save"></i>
                        <span> Guardar</span>
                    </button>
                </div>
            </form>
        </Modal>
    )
}
