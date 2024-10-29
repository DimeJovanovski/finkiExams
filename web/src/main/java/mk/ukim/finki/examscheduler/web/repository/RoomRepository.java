package mk.ukim.finki.examscheduler.web.repository;

import mk.ukim.finki.examscheduler.web.model.Room;
import mk.ukim.finki.examscheduler.web.model.projections.RoomNameProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    List<RoomNameProjection> findAllBy();
    Set<Room> findByNameIn(Set<String> names);
    @Query("select r.name from Room r")
    Set<String> findAllRoomNames();
}