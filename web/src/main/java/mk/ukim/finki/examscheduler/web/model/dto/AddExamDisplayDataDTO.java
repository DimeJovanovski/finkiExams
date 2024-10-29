package mk.ukim.finki.examscheduler.web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mk.ukim.finki.examscheduler.web.model.projections.SubjectProjection;

import java.util.List;
import java.util.Set;

/*
    DTO for injecting data into dialog
    for adding new exam.
*/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddExamDisplayDataDTO {
    private List<SubjectProjection> subjects;
    private Set<String> sessions;
    private Set<String> rooms;
}
