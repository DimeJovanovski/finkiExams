import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { fetchRoomNames, fetchExams, deleteExam, editExam } from './api/api';
import { getColorByStudyCycle } from './utils/studyCycleColors';
import { Modal } from "@daypilot/modal";

const Schedule = forwardRef(({ startDate, onEventsChange }, ref) => {
  const [columns, setColumns] = useState([]);
  const [events, setEvents] = useState([]);
  
  const userRole = localStorage.getItem('role');

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    const seconds = (`0${date.getSeconds()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const openEditForm = async (event) => {
    const form = [
      { type: 'title', name: `${event.subjectName} (${event.subjectAbbreviation})` },
      { 
        type: 'datetime', 
        id: 'fromTime', 
        name: 'Од', 
        dateFormat: 'yyyy-MM-dd', 
        timeFormat: 'HH:mm', 
        value: formatTime(event.start)
      },
      { 
        type: 'datetime', 
        id: 'toTime', 
        name: 'До', 
        dateFormat: 'yyyy-MM-dd', 
        timeFormat: 'HH:mm', 
        value: formatTime(event.end)
      },
      ...columns.map((room) => ({
        type: 'checkbox',
        id: room.id,
        name: room.name
      }))
    ];

    const data = columns.reduce((acc, room) => {
      acc[room.id] = event.rooms.split(', ').includes(room.name.trim());
      return acc;
    }, {
      fromTime: event.start,
      toTime: event.end,
      subjectName: event.text,
      subjectId: event.id
    });

    const modal = await DayPilot.Modal.form(form, data);
    if (!modal.canceled) {
      const updatedData = modal.result;

      const requestBody = {
        id: event.id,
        subjectAbbreviation: event.subjectAbbreviation,
        subjectName: event.text,
        studyCycle: event.studyCycle,
        durationMinutes: (new Date(updatedData.toTime) - new Date(updatedData.fromTime)) / (1000 * 60),
        fromTime: updatedData.fromTime,
        toTime: updatedData.toTime,
        roomNames: columns.filter(room => updatedData[room.id]).map(room => room.name)
      };

      try {
        await editExam(event.id, requestBody);
        refreshEvents();
      } catch (error) {
        console.error('Failed to update exam:', error);
      }
    }
  };

  const refreshEvents = async () => {
    try {
      const examsResponse = await fetchExams();
      const examEvents = examsResponse.data.flatMap((exam) => {
        const rooms = `${exam.roomNames}`.replace(/,/g, ", ");
        return exam.roomNames.map((roomName) => ({
          id: `${exam.id}`,
          text: `${exam.subjectAbbreviation}`,
          subjectAbbreviation: `${exam.subjectAbbreviation}`,
          subjectName: `${exam.subjectName}`,
          start: exam.fromTime,
          end: exam.toTime,
          rooms: rooms,
          barColor: getColorByStudyCycle(exam.studyCycle),
          moveVDisabled: true,
          moveHDisabled: true,
          resource: `R${columns.findIndex(col => col.name === roomName) + 1}`
        }));
      });
      setEvents(examEvents);
      if (onEventsChange) {
        onEventsChange(examEvents);
      }
    } catch (error) {
      console.error("Error refreshing events:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshEvents
  }));

  const contextMenuItems = [
    {
      text: "Уреди",
      onClick: (args) => {
        openEditForm(args.source.data);
      },
      visible: userRole === 'ADMIN'
    },
    {
      text: "Избриши",
      onClick: async (args) => {
        const eventId = args.source.data.id;
        const confirmation = await DayPilot.Modal.confirm("Дали сте сигурни дека сакате да го избришете испитот?");
        if (confirmation.result) {
          try {
            await deleteExam(eventId);
            console.log(`Deleted exam with id ${eventId} successfully.`);
            refreshEvents();
          } catch (error) {
            console.error(`Failed to delete exam with id ${eventId}.`, error);
          }
        } else {
          console.log("Deletion canceled.");
        }
      },
      visible: userRole === 'ADMIN'
    }
  ].filter(item => item.visible); // Filter based on visibility

  const config = {
    viewType: "Resources",
    cellWidth: 300,
    eventHeight: 30,
    showEventTime: true,
    contextMenu: new DayPilot.Menu({
      items: contextMenuItems,
    }),
    onEventClick: (args) => {
      const event = args.e.data;
      function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        return `${hours}:${minutes}h    ${day}.${month}.${year}`;
      }

      DayPilot.Modal.alert(`
        <h2>${event.subjectName} (${event.subjectAbbreviation})</h2>
        <b>Од:</b> ${formatDateTime(event.start)}<br>
        <b>До:</b> ${formatDateTime(event.end)}<br>
        <b>Простории:</b> ${event.rooms}
      `);
    }
  };

  useEffect(() => {
    Promise.all([fetchRoomNames(), fetchExams()])
      .then(([roomsResponse, examsResponse]) => {
        const roomColumns = roomsResponse.data.map((room, index) => ({
          name: room.name,
          id: `R${index + 1}`
        }));
        setColumns(roomColumns);

        const examEvents = examsResponse.data.flatMap((exam) => {
          const rooms = `${exam.roomNames}`.replace(/,/g, ", ");
          return exam.roomNames.map((roomName) => ({
            id: `${exam.id}`,
            text: `${exam.subjectAbbreviation}`,
            subjectAbbreviation: `${exam.subjectAbbreviation}`,
            subjectName: `${exam.subjectName}`,
            start: exam.fromTime,
            end: exam.toTime,
            rooms: rooms,
            barColor: getColorByStudyCycle(exam.studyCycle),
            moveVDisabled: true,
            moveHDisabled: false,
            resource: `R${roomColumns.findIndex(col => col.name === roomName) + 1}`
          }));
        });
        setEvents(examEvents);

        if (onEventsChange) {
          onEventsChange(examEvents);
        }
      })
      .catch(error => {
        console.error("Error fetching data from the API", error);
      });
  }, [onEventsChange]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <DayPilotCalendar
        {...config}
        timeFormat='Clock24Hours'
        startDate={startDate}
        columns={columns}
        events={events}
        eventMoveHandling='false'
        eventResizeHandling='false'
        cellWidth={200}
      />
    </div>
  );
});

export default Schedule;
