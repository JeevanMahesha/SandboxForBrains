package io.application.user.mongodb.Services;

import io.application.user.mongodb.DTO.UserPatch;
import io.application.user.mongodb.Models.UsersModel;
import io.application.user.mongodb.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServices {

    @Autowired
    private UsersRepository usersRepository;

    public Map<String, Object> getAllUsers(Integer total, Integer pageNumber){
        PageRequest paging = PageRequest.of(total, pageNumber);
        Page<UsersModel> pagedResult = usersRepository.findAll(paging);
        Map<String, Object> response = new HashMap<>();
        if(pagedResult.hasContent()) {
            response.put("Users", pagedResult.getContent());
            response.put("currentPage", pagedResult.getNumber());
            response.put("totalItems", pagedResult.getTotalElements());
            response.put("totalPages", pagedResult.getTotalPages());
        }
        return response;
    }

    public void addNewUser(UsersModel newUserData){
        usersRepository.insert(newUserData);
    }

    public boolean updateUser(UsersModel updateUser,Long id){
        Optional<UsersModel> DBData =  usersRepository.findById(id);
        if (DBData.isPresent()) {
            UsersModel _dbData = DBData.get();
            _dbData.setName(updateUser.getName());
            usersRepository.save((_dbData));
            return true;
        }
        return false;
    }

    public boolean deleteUser(long id) {
        Optional<UsersModel> DBData =  usersRepository.findById(id);
        if (DBData.isPresent()) {
            usersRepository.delete(DBData.get());
            return true;
        }
        return false;
    }

//    public String patchAction(UserPatch newPatchData, Long id) {
//        String action = newPatchData.getAction();
//        if (action == "replace") {
//            Optional<UsersModel> DBData = usersRepository.findById(id);
//            if (DBData.isPresent()) {
//                UsersModel _dbData = DBData.get();
//                if (newPatchData.getFieldName().equals("address")) {
//                    _dbData.getUserDetails().get("address");
//                    _dbData.setName(newPatchData.getValue());
//                    userRepo.save(_dbData);
//                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
//                }
//                if (newPatchData.getFieldName().equals("email")) {
//                    _dbData.setEmail(newPatchData.getValue());
//                    userRepo.save(_dbData);
//                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
//                }
//
//            }
//        } else if (action == "del") {
//            Optional<userModel> DBData = userRepo.findById(id);
//            if (DBData.isPresent()) {
//                userModel _dbData = DBData.get();
//                if (newPatchData.getFieldName().equals("Name")) {
//                    _dbData.setName(newPatchData.getValue());
//                    userRepo.save(_dbData);
//                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
//                }
//                if (newPatchData.getFieldName().equals("email")) {
//                    _dbData.setEmail(newPatchData.getValue());
//                    userRepo.save(_dbData);
//                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
//                }
//
//            }
//        } else if (action == "add") {
//            Optional<userModel> DBData = userRepo.findById(id);
//            if (DBData.isPresent()) {
//                userModel _dbData = DBData.get();
//                if (newPatchData.getFieldName().equals("Name")) {
//                    _dbData.setName(newPatchData.getValue());
//                    userRepo.save(_dbData);
//                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
//                }
//                if (newPatchData.getFieldName().equals("email")) {
//                    _dbData.setEmail(newPatchData.getValue());
//                    userRepo.save(_dbData);
//                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
//                }
//
//            }
//        }
//        return "Action is not Available";
//    }

}
