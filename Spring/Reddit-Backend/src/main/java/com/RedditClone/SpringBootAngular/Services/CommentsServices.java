package com.RedditClone.SpringBootAngular.Services;

import com.RedditClone.SpringBootAngular.AOP.SpringRedditException;
import com.RedditClone.SpringBootAngular.Config.UtilityFunctions;
import com.RedditClone.SpringBootAngular.DTO.CommentFlag;
import com.RedditClone.SpringBootAngular.DTO.CommentRequest;
import com.RedditClone.SpringBootAngular.DTO.CommentResponse;
import com.RedditClone.SpringBootAngular.Models.Comments;
import com.RedditClone.SpringBootAngular.Models.Users;
import com.RedditClone.SpringBootAngular.Repository.CommentRepository;
import com.RedditClone.SpringBootAngular.Repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CommentsServices {

    private final CommentRepository commentRepository;
    private final UtilityFunctions utilityFunctions;
    private final AuthServices authServices;
    private final UserRepository userRepository;

    public void addNewComment(CommentRequest commentRequest) {
        try {
            Comments newComment = new Comments();
            newComment.setId(utilityFunctions.generateID("COMMENT"));
            newComment.setText(commentRequest.getText());
            newComment.setPostId(commentRequest.getPostId());
            newComment.setUserId(authServices.getCurrentUser());
            newComment.setCommentFlags(new ArrayList<>());
            newComment.setCreatedDate(LocalDateTime.now());
            commentRepository.insert(newComment);
        } catch (Exception e){
            throw new SpringRedditException("Unable to add comment "+ e.getMessage());
        }

    }

    public Object getAllCommentsByPostId(String id) {
      List<Comments> commentsByPostId = commentRepository.findBypostId(id);
      if(commentsByPostId.isEmpty()){
          return "No Comments For this post Id" + id;
      }
      return mappingComments(commentsByPostId);
    }

    private boolean checkCurrentUserFlag(String currentUser, List<CommentFlag> commentFlags) {
        for (CommentFlag eachCommentFlag:commentFlags){
            if (eachCommentFlag.getUserId().equals(currentUser)) {
                return true;
            }
        }
        return false;
    }


    private Object mappingComments(List<Comments> commentsByPostId){
        List<CommentResponse> commentResponseList = new ArrayList<>();
        String currentUser = authServices.getCurrentUser();
        for (Comments eachComment:commentsByPostId) {
                CommentResponse commentResponse = CommentResponse
                        .builder()
                        .commentId(eachComment.getId())
                        .duration(eachComment.getCreatedDate().toString().split("T")[0])
                        .commentFlagsCount(eachComment.getCommentFlags().size())
                        .username(userRepository.findById(eachComment.getUserId()).get().getUsername())
                        .commentFlags(eachComment.getCommentFlags())
                        .iFlagged(checkCurrentUserFlag(currentUser,eachComment.getCommentFlags()))
                        .postId(eachComment.getPostId())
                        .text(eachComment.getText())
                        .build();
                commentResponseList.add(commentResponse);
            }
        return commentResponseList;
    }




    public List<CommentRequest> getAllCommentsByUser(String name) {
        Optional<Users> byUsername = userRepository.findByUsername(name);
      List<Comments> commentsList = commentRepository.findByuserId(byUsername.get().getId());
      List<CommentRequest> allCommentsByUserName = new ArrayList<>();
      for (Comments eachComments:commentsList){
          CommentRequest commentRequest = CommentRequest
                  .builder()
                  .postId(eachComments.getPostId())
                  .userName(name)
                  .id(eachComments.getId())
                  .text(eachComments.getText())
                  .createdDate(eachComments.getCreatedDate())
                  .build();
          allCommentsByUserName.add(commentRequest);
      }
      return allCommentsByUserName ;
    }
    private boolean checkSameUser(String userId, String currentUser) {
          if (currentUser.equals(userId)) {
            return true;
        }
        return false;
    }


    public String addFlagToComment(String id, CommentFlag commentFlag) {
        Optional<Comments> commentbyId = commentRepository.findById(id);
        Comments dbComment = commentbyId.get();
        Optional<Users> userDeail = userRepository.findByUsername(commentFlag.getUserName());
        String currentUser = authServices.getCurrentUser();
        if (checkSameUser(dbComment.getUserId(), currentUser)) {
            return "You can't Flag your own comment";
        }
        if (!dbComment.getCommentFlags().isEmpty()) {
            for (CommentFlag eachFlag:commentbyId.get().getCommentFlags()){
                if (eachFlag.getUserId().equals(userDeail.get().getId())) {
                    return "You Have Already Flag This Comment";
                }
            }
        }
        CommentFlag newcommentFlag = CommentFlag
                .builder()
                .flagText(commentFlag.getFlagText())
                .userId(userDeail.get().getId())
                .userName(commentFlag.getUserName())
                .build();
        dbComment.getCommentFlags().add(newcommentFlag);
        commentRepository.save(dbComment);
        return "Flag Added Successfully";
    }
}
