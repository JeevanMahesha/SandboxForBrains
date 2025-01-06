package com.RedditClone.SpringBootAngular.Controllers;

import com.RedditClone.SpringBootAngular.DTO.PostRequest;
import com.RedditClone.SpringBootAngular.DTO.PostResponse;
import com.RedditClone.SpringBootAngular.Services.PostServices;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {

    private final PostServices postServices;

    @PostMapping
    public ResponseEntity<String> createNewPost(@RequestBody PostRequest postRequest){
        try{
            postServices.addNewPost(postRequest);
        }catch (Exception e){
           return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<String>("Post Created Successfully",HttpStatus.CREATED);
    }

    @GetMapping
    public List<PostResponse> getAllPosts(){
        return postServices.getAllPost();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable String id){
        return new ResponseEntity<PostResponse>(postServices.getOnePost(id).get(0),HttpStatus.OK);
    }

    @GetMapping("/subredditid/{id}")
    public ResponseEntity<List<PostResponse>> getPostBySubRedditId(@PathVariable String id){
       return new ResponseEntity<List<PostResponse>>(postServices.getPostsBySubRedditId(id),HttpStatus.OK);
    }

    @GetMapping("/userid")
    public ResponseEntity<List<PostResponse>> getPostByUserId(){
        return new ResponseEntity<List<PostResponse>>(postServices.getPostsByUserId(),HttpStatus.OK) ;
    }


}
