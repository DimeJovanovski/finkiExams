package mk.ukim.finki.examscheduler.web.service.impl;

import mk.ukim.finki.examscheduler.web.model.*;
import mk.ukim.finki.examscheduler.web.model.dto.AddExamDTO;
import mk.ukim.finki.examscheduler.web.model.dto.AddExamDisplayDataDTO;
import mk.ukim.finki.examscheduler.web.model.dto.SubjectExamDTO;
import mk.ukim.finki.examscheduler.web.model.enumerations.StudyCycle;
import mk.ukim.finki.examscheduler.web.model.projections.SubjectProjection;
import mk.ukim.finki.examscheduler.web.repository.*;
import mk.ukim.finki.examscheduler.web.service.SubjectExamService;
import mk.ukim.finki.examscheduler.web.service.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SubjectExamServiceImpl implements SubjectExamService {
    private final SubjectExamRepository subjectExamRepository;
    private final RoomRepository roomRepository;
    private final SubjectService subjectService;
    private final YearExamSessionRepository sessionRepository;
    private final SubjectRepository subjectRepository;
    private final JoinedSubjectRepository joinedSubjectRepository;
    private final ExamDefinitionRepository examDefinitionRepository;

    public SubjectExamServiceImpl(
            SubjectExamRepository subjectExamRepository,
            RoomRepository roomRepository,
            SubjectService subjectService,
            YearExamSessionRepository sessionRepository, SubjectRepository subjectRepository, JoinedSubjectRepository joinedSubjectRepository, ExamDefinitionRepository examDefinitionRepository
    ) {
        this.subjectExamRepository = subjectExamRepository;
        this.roomRepository = roomRepository;
        this.subjectService = subjectService;
        this.sessionRepository = sessionRepository;
        this.subjectRepository = subjectRepository;
        this.joinedSubjectRepository = joinedSubjectRepository;
        this.examDefinitionRepository = examDefinitionRepository;
    }

    @Override
    public List<SubjectExamDTO> getForCalendarDisplay() {
        return subjectExamRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SubjectExam> findById(String id) {
        return this.subjectExamRepository.findById(id);
    }

    @Override
    public Optional<SubjectExam> edit(String id, SubjectExamDTO subjectExamDTO) {
        SubjectExam exam = this.subjectExamRepository.findById(id).orElse(null);

        exam.setFromTime(subjectExamDTO.getFromTime());
        exam.setToTime(subjectExamDTO.getToTime());
        Set<Room> rooms = this.roomRepository.findByNameIn(subjectExamDTO.getRoomNames());
        exam.setRooms(rooms);

        this.subjectExamRepository.save(exam);
        return Optional.of(exam);
    }

    @Override
    public Optional<SubjectExam> save(AddExamDTO addExamDTO) {
        YearExamSession yearExamSession = this.sessionRepository.findById(addExamDTO.getSessionId())
                .orElseThrow(() -> new RuntimeException());

        Subject subject = this.subjectRepository.findById(addExamDTO.getSubjectId())
                .orElseThrow(() -> new RuntimeException());

        JoinedSubject joinedSubject = this.joinedSubjectRepository.findById(subject.getAbbreviation())
                .orElseThrow(() -> new RuntimeException());

        Set<Room> rooms = this.roomRepository.findByNameIn(addExamDTO.getRoomNames());

        ExamDefinition examDefinition = new ExamDefinition();
        examDefinition.setId( subject.getAbbreviation() + "-" + yearExamSession.getSession() );
        examDefinition.setSubject(joinedSubject);
        examDefinition.setExamSession(yearExamSession.getSession());
        this.examDefinitionRepository.save(examDefinition);

        SubjectExam exam = new SubjectExam(examDefinition, yearExamSession);
        exam.setFromTime(addExamDTO.getFromTime());
        exam.setToTime(addExamDTO.getToTime());
        exam.setRooms(rooms);
        exam.setComment(addExamDTO.getComment());

        this.subjectExamRepository.save(exam);
        return Optional.of(exam);
    }

    private SubjectExamDTO convertToDTO(SubjectExam subjectExam) {
        // extract study cycle
        StudyCycle studyCycle = subjectExam.getDefinition().getSubject().getCycle();

        // extract room names
        Set<String> roomNames = subjectExam.getRooms().stream()
                .map(Room::getName)
                .collect(Collectors.toSet());

        return new SubjectExamDTO(
                subjectExam.getId(),
                subjectExam.getDefinition().getSubject().getAbbreviation(),
                subjectExam.getDefinition().getSubject().getName(),
                studyCycle,
                subjectExam.getDurationMinutes(),
                subjectExam.getFromTime(),
                subjectExam.getToTime(),
                roomNames
        );
    }

    @Override
    public void deleteById(String id) {
        this.subjectExamRepository.deleteById(id);
    }

    @Override
    public Optional<AddExamDisplayDataDTO> getDataForAddExamDialog() {
        List<SubjectProjection> subjects = this.subjectService
                .getSubjectDataForAddExamDialog();
        Set<String> rooms = this.roomRepository.findAllRoomNames();
        Set<String> sessions = this.sessionRepository.findAllSessionNames();

        AddExamDisplayDataDTO dto = new AddExamDisplayDataDTO();
        dto.setSubjects(subjects);
        dto.setRooms(rooms);
        dto.setSessions(sessions);

        return Optional.of(dto);
    }
}

