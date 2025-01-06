package amigoscode.springboot.application.SprintBoot.Services;

import amigoscode.springboot.application.SprintBoot.Models.StudentModel;
import amigoscode.springboot.application.SprintBoot.Repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StudentServices {

    @Autowired
    private final StudentRepository studentRepository;

    public List<StudentModel> getStudents(){
       return studentRepository.findAll();
    }

    public void addNewStudent(StudentModel newStudent) {
        Optional<StudentModel> studentEmail = studentRepository.findByEmail(newStudent.getEmail());
        if (studentEmail.isPresent()) {
            throw new IllegalStateException("Email already exist");
        }
        studentRepository.save(newStudent);
    }

    public void deleteStudent(Long id) {
        boolean studentExist = studentRepository.existsById(id);
        if (!studentExist) {
            throw new IllegalStateException("Student Don't Exist");
        }
        studentRepository.deleteById(id);
    }

    @Transactional
    public void updateStudent(Long id, String name, String email) {
        StudentModel student = studentRepository.findById(id).orElseThrow(
                ()->new IllegalStateException("Student Don't Exist")
        );
        if (name != null && name.length() > 0 && !Objects.equals(student.getName(),name)) {
            student.setName(name);
        }
        if (email != null && email.length() > 0 && !Objects.equals(student.getEmail(),email)) {
            Optional<StudentModel> studentEmail = studentRepository.findByEmail(email);

            if (studentEmail.isPresent()) {
                throw new IllegalStateException();
            }
            student.setEmail(email);
        }
    }
}
