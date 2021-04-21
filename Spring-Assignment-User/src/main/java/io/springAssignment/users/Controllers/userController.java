package io.springAssignment.users.Controllers;

import io.springAssignment.users.DTO.UserPatch;
import io.springAssignment.users.Models.userModel;
import io.springAssignment.users.Services.userServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api")
public class userController {

    @Autowired
    private userServices userService;

    @GetMapping("/token")
    public ResponseEntity<String> token(@RequestHeader(name = "Authorization") String token){
        return new ResponseEntity("The Authorization is " + token.toString(),HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<userModel>> getAllUsers(
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize
    ){
            List<userModel> allUsers = userService.getAllUser(pageNo,pageSize);
            return new ResponseEntity<>(allUsers, HttpStatus.OK);

    }

    @GetMapping("/users/{id}")
    public ResponseEntity<userModel> getUser(@PathVariable long id){
        userModel userData =  userService.getUser(id);
        if(userData != null){
            return new  ResponseEntity<>(userData,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/users")
    public  ResponseEntity<userModel> addNewUser(@RequestBody userModel newUser){
      try {
          userModel userData = userService.addNewUser(newUser);
          return new ResponseEntity<>(userData,HttpStatus.CREATED);
      }catch (Exception e){
          return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<userModel> updateUser(@PathVariable long id,@RequestBody userModel updateUserData){
        userModel userData = userService.updateUser(id,updateUserData);
        if (userData != null) {
            return new ResponseEntity<>(userData,HttpStatus.OK);
        }
        return  new ResponseEntity<>(null,HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable long id){
        boolean deleteStatus = userService.deleteUser(id);
        if (deleteStatus){
            return new ResponseEntity<>("User Deleted Successfully",HttpStatus.OK);
        }
        return new ResponseEntity<>("Unable to Delete the user",HttpStatus.OK);
    }

    @PatchMapping("/users/{id}")
    public List<UserPatch> patchFunction(@RequestBody List<UserPatch> patchData, @PathVariable long id){
            try {
                if(userService.findUserById(id)){
                    return patchData;
                }
            }catch (Exception e){
                return null;
            }
        return null;
    }

}
