package mk.ukim.finki.examscheduler.web.web.rest;

import mk.ukim.finki.examscheduler.web.model.projections.RoomNameProjection;
import mk.ukim.finki.examscheduler.web.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173"})
@RequestMapping("/api/rooms")
public class RoomRestController {
    private final RoomService roomService;

    public RoomRestController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/names")
    public ResponseEntity<List<RoomNameProjection>> getForCalendarDisplay() {
        List<RoomNameProjection> roomNames = roomService.getForCalendarDisplay();
        return ResponseEntity.ok(roomNames);
    }
}
