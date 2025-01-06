package io.springAssignment.users.Services;

import io.springAssignment.users.DTO.UserPatch;
import io.springAssignment.users.Models.userModel;
import io.springAssignment.users.Repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class userServices {

    @Autowired
    private userRepository userRepo;

    public List<userModel> getAllUser( Integer pageNo, Integer pageSize){
        Pageable paging = PageRequest.of(pageNo, pageSize);
        Page<userModel> pagedResult = userRepo.findAll(paging);
        if(pagedResult.hasContent()) {
            return pagedResult.getContent();
        } else {
            return new ArrayList<userModel>();
        }
    }


    public userModel addNewUser(userModel newUserData){
       return userRepo.save(newUserData);
    }

    public userModel updateUser(long id,userModel userData){
        Optional<userModel> DBData =  userRepo.findById(id);
        if (DBData.isPresent()) {
            userModel _dbData = DBData.get();
            _dbData.setName(userData.getName());
            _dbData.setEmail(userData.getEmail());
            return userRepo.save(_dbData);
        }
        return null;
    }

    public userModel getUser(long id) {
        Optional<userModel> DBData =  userRepo.findById(id);
        if (DBData.isPresent()) {
            return DBData.get();
        }
        return null;
    }

    public boolean deleteUser(long id) {
        Optional<userModel> DBData =  userRepo.findById(id);
        if (DBData.isPresent()) {
            userRepo.delete(DBData.get());
            return true;
        }
        return false;
    }

    public boolean findUserById(long id){
        Optional<userModel> DBData =  userRepo.findById(id);
        if (DBData.isPresent()) {
            return true;
        }
        return false;
    }

    public List<String> patchCall(List<UserPatch> patchData,long id){
        List<String> statusList = new ArrayList<>() ;
        for (int i = 0; i < patchData.size() ; i++) {
            statusList.add(patchAction(patchData.get(i),id));
        }
        return statusList;
    }

    public String patchAction(UserPatch newPatchData,long id) {
        String action = newPatchData.getAction();
        if (action == "replace") {
            Optional<userModel> DBData = userRepo.findById(id);
            if (DBData.isPresent()) {
                userModel _dbData = DBData.get();
                if (newPatchData.getFieldName().equals("Name")) {
                    _dbData.setName(newPatchData.getValue());
                    userRepo.save(_dbData);
                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
                }
                if (newPatchData.getFieldName().equals("email")) {
                    _dbData.setEmail(newPatchData.getValue());
                    userRepo.save(_dbData);
                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
                }

            }
        } else if (action == "del") {
            Optional<userModel> DBData = userRepo.findById(id);
            if (DBData.isPresent()) {
                userModel _dbData = DBData.get();
                if (newPatchData.getFieldName().equals("Name")) {
                    _dbData.setName(newPatchData.getValue());
                    userRepo.save(_dbData);
                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
                }
                if (newPatchData.getFieldName().equals("email")) {
                    _dbData.setEmail(newPatchData.getValue());
                    userRepo.save(_dbData);
                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
                }

            }
        } else if (action == "add") {
            Optional<userModel> DBData = userRepo.findById(id);
            if (DBData.isPresent()) {
                userModel _dbData = DBData.get();
                if (newPatchData.getFieldName().equals("Name")) {
                    _dbData.setName(newPatchData.getValue());
                    userRepo.save(_dbData);
                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
                }
                if (newPatchData.getFieldName().equals("email")) {
                    _dbData.setEmail(newPatchData.getValue());
                    userRepo.save(_dbData);
                    return " " + newPatchData.getAction() + " " + newPatchData.getFieldName() + " Done";
                }

            }
        }
        return "Action is not Available";
    }
}
