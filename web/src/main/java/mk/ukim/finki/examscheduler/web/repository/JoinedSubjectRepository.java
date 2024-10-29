package mk.ukim.finki.examscheduler.web.repository;

import mk.ukim.finki.examscheduler.web.model.JoinedSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JoinedSubjectRepository extends JpaRepository<JoinedSubject, String> {
}
