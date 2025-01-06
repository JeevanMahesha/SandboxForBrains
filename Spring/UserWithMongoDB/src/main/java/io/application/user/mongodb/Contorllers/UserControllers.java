package io.application.user.mongodb.Contorllers;


import io.application.user.mongodb.Models.UsersModel;
import io.application.user.mongodb.Services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class UserControllers {

    @Autowired
    private UserServices userServices;

    @GetMapping("/users")
    public ResponseEntity<Map<String,Object>> getAllUsers(
            @RequestParam(defaultValue = "0") Integer total,
            @RequestParam(defaultValue = "10") Integer pageNumber
    ){
        Map<String,Object> allUsers =  userServices.getAllUsers(total,pageNumber);
        return new ResponseEntity<>(allUsers, HttpStatus.OK) ;
    }

    @PostMapping("/users")
    public  ResponseEntity<String> addNewUser(@RequestBody UsersModel newUserData){
        try {
            userServices.addNewUser(newUserData);
            return new ResponseEntity<>("New User Inserted",HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Unable to Insert the user",HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id,@RequestBody UsersModel updateUserData){
        Boolean userData = userServices.updateUser(updateUserData,id);
        if (userData) {
            return new ResponseEntity<>("Updated successfully",HttpStatus.OK);
        }
        return  new ResponseEntity<>("Unable to Update",HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        boolean deleteStatus = userServices.deleteUser(id);
        if (deleteStatus){
            return new ResponseEntity<>("User Deleted Successfully",HttpStatus.OK);
        }
        return new ResponseEntity<>("Unable to Delete the user",HttpStatus.OK);
    }
}
