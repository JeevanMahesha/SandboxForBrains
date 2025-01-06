package com.RedditClone.SpringBootAngular.Controllers;

import com.RedditClone.SpringBootAngular.DTO.CommentFlag;
import com.RedditClone.SpringBootAngular.DTO.CommentRequest;
import com.RedditClone.SpringBootAngular.Services.CommentsServices;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CommentsController {

    private final CommentsServices commentsServices;

    @PostMapping
    public ResponseEntity<String> createComment(@RequestBody CommentRequest commentRequest){
        try {
            commentsServices.addNewComment(commentRequest);
        }catch (Exception e){
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<String>("Comment added successfully",HttpStatus.CREATED);
    }

    @GetMapping("/postid/{id}")
    public Object getCommentsByPostId(@PathVariable String id){
        return commentsServices.getAllCommentsByPostId(id);
    }

    @GetMapping("/username/{name}")
    public List<CommentRequest> getCommentsByUserId(@PathVariable String name){
        return commentsServices.getAllCommentsByUser(name);
    }

    @PostMapping("/flag/{id}")
    public ResponseEntity<String> addFlagToComment(@PathVariable String id , @RequestBody CommentFlag commentFlag){
       return new  ResponseEntity<String>( commentsServices.addFlagToComment(id,commentFlag),HttpStatus.OK);
    }
}
