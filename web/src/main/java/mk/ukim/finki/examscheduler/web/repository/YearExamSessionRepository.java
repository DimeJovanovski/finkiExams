package mk.ukim.finki.examscheduler.web.repository;

import mk.ukim.finki.examscheduler.web.model.YearExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface YearExamSessionRepository extends JpaRepository<YearExamSession, String> {
    @Query("select s.name from YearExamSession s")
    Set<String> findAllSessionNames();
}
