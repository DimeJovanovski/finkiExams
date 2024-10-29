package mk.ukim.finki.examscheduler.web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

/*
    DTO for adding new exam to database.
*/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddExamDTO {
    private String subjectId;
    private String sessionId;
    private LocalDateTime fromTime;
    private LocalDateTime toTime;
    private String comment;
    private Set<String> roomNames;
}
