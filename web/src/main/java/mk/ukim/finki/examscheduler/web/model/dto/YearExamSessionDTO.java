package mk.ukim.finki.examscheduler.web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class YearExamSessionDTO {
    private String name;
    private LocalDate sessionStart;
    private LocalDate sessionEnd;
}
