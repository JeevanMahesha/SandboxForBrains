package com.RedditClone.SpringBootAngular.Controllers;

import com.RedditClone.SpringBootAngular.DTO.SubredditDTO;
import com.RedditClone.SpringBootAngular.Models.SubReddit;
import com.RedditClone.SpringBootAngular.Services.SubredditService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subreddit")
@Slf4j
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SubredditController {

    private final SubredditService subredditService;

    @PostMapping
    public ResponseEntity<String> createSubreddit(@RequestBody SubredditDTO subredditDTO){
        try {
              subredditService.createSubreddit(subredditDTO);
        }catch (Exception e){
            return new ResponseEntity<String>("Failed " + e.getMessage(), HttpStatus.ALREADY_REPORTED);
        }
        return new ResponseEntity<String>("Subreddit added Successfully ",HttpStatus.CREATED) ;
    }

    @GetMapping
    public List<SubredditDTO> getAllSubreddit(){
       return subredditService.getAllSubreddit();
    }

    @GetMapping("/{id}")
    public Optional<SubReddit> getSubreddit(@PathVariable String id){
     return subredditService.getSubreddit(id);
    }

}
