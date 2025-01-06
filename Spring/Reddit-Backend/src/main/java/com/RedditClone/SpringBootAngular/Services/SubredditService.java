package com.RedditClone.SpringBootAngular.Services;

import com.RedditClone.SpringBootAngular.AOP.SpringRedditException;
import com.RedditClone.SpringBootAngular.Config.UtilityFunctions;
import com.RedditClone.SpringBootAngular.DTO.SubredditDTO;
import com.RedditClone.SpringBootAngular.Models.SubReddit;
import com.RedditClone.SpringBootAngular.Repository.PostRepository;
import com.RedditClone.SpringBootAngular.Repository.SubredditRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class SubredditService {

    private final UtilityFunctions utilityFunctions;
    private final SubredditRepository subredditRepository;
    private final PostRepository postRepository;


    public void createSubreddit(SubredditDTO subredditDTO){
       Optional<SubReddit> subredditName = subredditRepository.findBySubRedditName(subredditDTO.getName());
        if (subredditName.isPresent()) {
            throw new SpringRedditException( subredditDTO.getName() +" Already exist");
        }
        SubReddit subReddit = new SubReddit();
        subReddit.setId(utilityFunctions.generateID("SUBREDDIT"));
        subReddit.setSubRedditName(subredditDTO.getName());
        subReddit.setDescription(subredditDTO.getDescription());
        subReddit.setUserId(subredditDTO.getUserId());
        subReddit.setCreatedDate(LocalDateTime.now());
        subredditRepository.insert(subReddit);
    }

    public List<SubredditDTO> getAllSubreddit() {
        List<SubReddit> subreddits = subredditRepository.findAll();
        List<SubredditDTO> allSubReddit = new ArrayList<>();
        for (SubReddit eachSubReddit: subreddits){
            SubredditDTO subredditDTO = SubredditDTO
                    .builder()
                    .name(eachSubReddit.getSubRedditName())
                    .description(eachSubReddit.getDescription())
                    .numberOfPosts(postCountOfSubReddit(eachSubReddit.getId()))
                    .build();
            allSubReddit.add(subredditDTO);
        }
        return allSubReddit;
    }

    public Optional<SubReddit> getSubreddit(String id) {
        Optional<SubReddit> subReddit = subredditRepository.findById(id);
        if (!subReddit.isPresent()) {
            throw new SpringRedditException("Subreddit Not Found");
        }
        return subReddit;
    }

    public int postCountOfSubReddit(String subredditId){
        return postRepository.findBysubredditId(subredditId).size();
    }
}
