package mk.ukim.finki.examscheduler.web.model.dto;

import lombok.*;
import mk.ukim.finki.examscheduler.web.model.enumerations.StudyCycle;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubjectExamDTO {
    private String id;
    private String subjectAbbreviation;
    private String subjectName;
    private StudyCycle studyCycle; // This will hold the list of cycles
    private Long durationMinutes;
    private LocalDateTime fromTime;
    private LocalDateTime toTime;
    private Set<String> roomNames;
}


