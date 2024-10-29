package mk.ukim.finki.examscheduler.web.web.rest;

import mk.ukim.finki.examscheduler.web.model.SubjectExam;
import mk.ukim.finki.examscheduler.web.model.dto.AddExamDTO;
import mk.ukim.finki.examscheduler.web.model.dto.AddExamDisplayDataDTO;
import mk.ukim.finki.examscheduler.web.model.dto.SubjectExamDTO;
import mk.ukim.finki.examscheduler.web.service.SubjectExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173"})
@RequestMapping("/api/exams")
public class SubjectExamRestController {
    private final SubjectExamService subjectExamService;

    public SubjectExamRestController(SubjectExamService subjectExamService) {
        this.subjectExamService = subjectExamService;
    }

    @GetMapping
    public List<SubjectExamDTO> getForCalendarDisplay() {
        return this.subjectExamService.getForCalendarDisplay();
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<SubjectExam> edit(@PathVariable String id, @RequestBody SubjectExamDTO dto) {
        return this.subjectExamService.edit(id, dto)
                .map(subjectExam -> ResponseEntity.ok().body(subjectExam))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @GetMapping("/addExamDialogData")
    public ResponseEntity<AddExamDisplayDataDTO> getDataForDisplayToAddExamDialog() {
        return this.subjectExamService.getDataForAddExamDialog()
                .map(data -> ResponseEntity.ok().body(data))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<SubjectExam> addExam(@RequestBody AddExamDTO dto) {
        return this.subjectExamService.save(dto)
                .map(data -> ResponseEntity.ok().body(data))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteById(@PathVariable String id) {
        this.subjectExamService.deleteById(id);
        if (this.subjectExamService.findById(id).isEmpty()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

}
