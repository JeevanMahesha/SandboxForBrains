package com.example.Students.controller;

import com.example.Students.entity.Student;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class index {
    @RequestMapping("/")
    public String jeevan() {
        return "Greetings from Spring Boot! to JEEVAN";
    }
    private static Map<String, Student> studentRepo = new HashMap<>();
    static {
        Student jeevan = new Student();
        jeevan.setStudentRollNumber("1");
        jeevan.setStudentName("Jeevan");
        jeevan.setStudentDept("cse");
        studentRepo.put(jeevan.getStudentRollNumber(),jeevan);
    }

    @RequestMapping(value = "/students")
    public ResponseEntity<Object> getStudents() {
        return new ResponseEntity<>(studentRepo.values(), HttpStatus.OK);
    }

    @RequestMapping(value = "/students", method = RequestMethod.POST)
    public ResponseEntity<Object> createStudent(@RequestBody Student student) {
        studentRepo.put(student.getStudentRollNumber(), student);
        return new ResponseEntity<>("Student is created successfully", HttpStatus.CREATED);
    }

    @RequestMapping(value = "/students/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> updateProduct(@PathVariable("id") String id, @RequestBody Student student) {
        studentRepo.remove(id);
        student.setStudentRollNumber(id);
        studentRepo.put(id, student);
        return new ResponseEntity<>("Student is updated successfully", HttpStatus.OK);
    }

    @RequestMapping(value = "/students/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") String id) {
        studentRepo.remove(id);
        return new ResponseEntity<>("student is deleted successfully", HttpStatus.OK);
    }
}
