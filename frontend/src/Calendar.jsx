import React, { Component } from 'react';
import { DayPilotNavigator } from "@daypilot/daypilot-lite-react";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      busyDays: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.events !== this.props.events) {
      this.updateBusyDays();
    }
  }

  updateBusyDays() {
    const { events } = this.props;

    const busyDays = Array.from(new Set(events.map(event => {
      const date = new Date(event.start);
      return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    })));

    this.setState({
      busyDays: busyDays.map(day => ({
        start: day,
        end: day,
        color: "#d3d3d3",
      })),
    });
  }

  handleDateSelection = (args) => {
    const { onDateSelect } = this.props;
    if (onDateSelect) {
      onDateSelect(args.day);  // Notify parent about the selected date
    }
  };

  render() {
    return (
      <DayPilotNavigator
        selectMode={"Day"}
        showMonths={1}
        skipMonths={1}
        onTimeRangeSelected={this.handleDateSelection}
        events={this.state.busyDays}
        startDate={this.props.selectedDate}  // Use the selected date from parent
      />
    );
  }
}

export default Calendar;
