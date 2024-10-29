package mk.ukim.finki.examscheduler.web.service;

import mk.ukim.finki.examscheduler.web.model.projections.SubjectProjection;

import java.util.List;

public interface SubjectService {
    /*
    Projection of subject table that returns:
        * id
        * name
        * abbreviation
     */
    List<SubjectProjection> getSubjectDataForAddExamDialog();
}
