package mk.ukim.finki.examscheduler.web.service;

import mk.ukim.finki.examscheduler.web.model.projections.RoomNameProjection;

import java.util.List;

public interface RoomService {
    /*
    Return the projection of the room table of the names only.
    The room names will be displayed in the calendar as resources.
     */
    List<RoomNameProjection> getForCalendarDisplay();
}
