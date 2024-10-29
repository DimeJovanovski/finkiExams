package mk.ukim.finki.examscheduler.web.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class SubjectExam {

    // 2022-23-JUNE-WP-JUNE-LAB
    @Id
    private String id;

    @ManyToOne
    private YearExamSession session;

    @ManyToOne
    private ExamDefinition definition;

    private Long durationMinutes;

    private Long previousYearAttendantsNumber;
    private Long previousYearTotalStudents;

    private Long attendantsNumber;
    private Long totalStudents;

    private Long expectedNumber;

    private Long numRepetitions; // termini ako ne go sobira vo site lab

    private LocalDateTime fromTime;
    private LocalDateTime toTime;

    @ManyToMany
    private Set<Room> rooms;

    @Column(length = 5000)
    private String comment;

    public SubjectExam(ExamDefinition definition, YearExamSession session) {
        this.definition = definition;
        this.session = session;
        this.id = String.format("%s-%s", session.getName(), definition.getId());
    }

}
