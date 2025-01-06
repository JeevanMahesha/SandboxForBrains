package amigoscode.springboot.application.SprintBoot.Configrations;

import amigoscode.springboot.application.SprintBoot.Models.StudentModel;
import amigoscode.springboot.application.SprintBoot.Repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Configuration
public class StudentConfig {

    @Bean
    CommandLineRunner commandLineRunner(StudentRepository studentRepository){
        return args -> {
            StudentModel jeevan = new StudentModel(
                    11L,
                    "Jeevan",
                    "Jeevan@gmail.com",
                    LocalDate.of(1997, Month.MARCH,05),
                    0
            );
            StudentModel latha = new StudentModel(
                    22L,
                    "latha",
                    "latha@gmail.com",
                    LocalDate.of(1979, Month.JANUARY,29),
                    0
            );
            studentRepository.saveAll(
                    List.of(jeevan,latha)
            );
        };
    }
}
