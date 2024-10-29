package mk.ukim.finki.examscheduler.web.model;

import jakarta.persistence.*;
import lombok.*;
import mk.ukim.finki.examscheduler.web.model.enumerations.RoomType;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Room {
    @Id
    private String name;

    private String locationDescription;

    private String equipmentDescription;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    private Long capacity;
}

