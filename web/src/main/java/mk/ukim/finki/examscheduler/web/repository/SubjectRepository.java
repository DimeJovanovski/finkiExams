package mk.ukim.finki.examscheduler.web.repository;

import mk.ukim.finki.examscheduler.web.model.Subject;
import mk.ukim.finki.examscheduler.web.model.projections.SubjectProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, String> {
    List<SubjectProjection> findAllBy();
}
