package amigoscode.springboot.application.SprintBoot.Repository;

import amigoscode.springboot.application.SprintBoot.Models.StudentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository
        extends JpaRepository<StudentModel,Long>{
    Optional<StudentModel> findByEmail(String email);

}
