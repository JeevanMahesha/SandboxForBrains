package amigoscode.springboot.application.SprintBoot.Controllers;


import amigoscode.springboot.application.SprintBoot.Models.StudentModel;
import amigoscode.springboot.application.SprintBoot.Services.StudentServices;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/students")
@AllArgsConstructor
public class StudentController {

    @Autowired
    private final StudentServices studentServices;

    @GetMapping
    public List<StudentModel> getStudents(){
        return  studentServices.getStudents();
    }

    @PostMapping
    public void addNewStudent(@RequestBody StudentModel newStudent){
        studentServices.addNewStudent(newStudent);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id){
        studentServices.deleteStudent(id);
    }

    @PutMapping("/{id}")
    public void updateStudent(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email
            ){
        studentServices.updateStudent(id,name,email);
    }

}
