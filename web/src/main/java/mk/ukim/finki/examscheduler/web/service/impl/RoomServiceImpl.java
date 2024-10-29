package mk.ukim.finki.examscheduler.web.service.impl;

import mk.ukim.finki.examscheduler.web.model.projections.RoomNameProjection;
import mk.ukim.finki.examscheduler.web.repository.RoomRepository;
import mk.ukim.finki.examscheduler.web.service.RoomService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public List<RoomNameProjection> getForCalendarDisplay() {
        return roomRepository.findAllBy();
    }
}
