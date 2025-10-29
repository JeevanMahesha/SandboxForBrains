package com.RedditClone.SpringBootAngular.Controllers;

import com.RedditClone.SpringBootAngular.DTO.VoteRequest;
import com.RedditClone.SpringBootAngular.Services.VoteService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class VotesController {
    private final VoteService voteService;

    @PostMapping
    public String voteToPost(@RequestBody VoteRequest voteRequest){
       return voteService.voteToPost(voteRequest);
    }

}
