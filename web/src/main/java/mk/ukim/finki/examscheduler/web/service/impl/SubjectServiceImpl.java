package mk.ukim.finki.examscheduler.web.service.impl;

import mk.ukim.finki.examscheduler.web.model.projections.SubjectProjection;
import mk.ukim.finki.examscheduler.web.repository.SubjectRepository;
import mk.ukim.finki.examscheduler.web.service.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public List<SubjectProjection> getSubjectDataForAddExamDialog() {
        return this.subjectRepository.findAllBy();
    }
}
