package com.RedditClone.SpringBootAngular.Services;

import com.RedditClone.SpringBootAngular.AOP.SpringRedditException;
import com.RedditClone.SpringBootAngular.Config.UtilityFunctions;
import com.RedditClone.SpringBootAngular.DTO.PostRequest;
import com.RedditClone.SpringBootAngular.DTO.PostResponse;
import com.RedditClone.SpringBootAngular.Models.Posts;
import com.RedditClone.SpringBootAngular.Models.SubReddit;
import com.RedditClone.SpringBootAngular.Models.Vote;
import com.RedditClone.SpringBootAngular.Repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class PostServices {

    private final PostRepository postRepository;
    private final UtilityFunctions utilityFunctions;
    private final SubredditRepository subredditRepository;
    private final AuthServices authServices;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final VotesWithMongoTemplate votesWithMongoTemplate;


    public void addNewPost(PostRequest postRequest) {
        try {
            String currentUser = authServices.getCurrentUser();
            Optional<SubReddit> bySubRedditName = subredditRepository.findBySubRedditName(postRequest.getSubredditName());
            if(!bySubRedditName.isPresent() || currentUser.isEmpty()){
                throw new SpringRedditException("subreddit or user not found");
            }
            Posts newPost = new Posts();
            newPost.setPostId(utilityFunctions.generateID("POST"));
            newPost.setPostName(postRequest.getPostName());
            newPost.setUrl(postRequest.getUrl());
            newPost.setDescription(postRequest.getDescription());
            newPost.setUserId(currentUser);
            newPost.setSubredditId(bySubRedditName.get().getId());
            newPost.setCreatedDate(LocalDateTime.now());
            postRepository.insert(newPost);
        }catch (Exception e){
            throw new SpringRedditException(e.getMessage());
        }
    }

    public List<PostResponse> getAllPost(){
        try{
            return mappingThePosts(postRepository.findAll(),"All");
        }catch (Exception e) {
            throw new SpringRedditException("Internal Server Error "+ e.getMessage());
        }
    }

    @Transactional
    public List<PostResponse> getOnePost(String postId){
        Optional<Posts> postById = postRepository.findById(postId);
        if (!postById.isPresent()) {
            throw new SpringRedditException("Post Not Found with id "+ postId);
        }
        List<PostResponse> postResponse = mappingThePosts(postById.stream().collect(Collectors.toList()),"null");
        return postResponse;
    }

    public List<PostResponse> getPostsBySubRedditId(String subRedditId){
       List<Posts> postsBySubRedditId =  postRepository.findBysubredditId(subRedditId);
        if (postsBySubRedditId.isEmpty()) {
            throw new SpringRedditException("No Post Found by SubReddit "+ subRedditId);
        }
        List<PostResponse> postResponse = mappingThePosts(postsBySubRedditId,"null");
        return postResponse;
    }

    public List<PostResponse> getPostsByUserId(){
        List<Posts> PostsByUserId = postRepository.findByuserId(authServices.getCurrentUser());
        if (PostsByUserId.isEmpty()) {
            throw new SpringRedditException("Post Not Found with User");
        }
        List<PostResponse> postResponse = mappingThePosts(PostsByUserId,"null");
        return postResponse;
    }

    public List<PostResponse> mappingThePosts(List<Posts> allPostsArray,String type){
        List<PostResponse> postResponsesList = new ArrayList<>();
            for (Posts eachValue:allPostsArray){
                boolean upVote = false;
                boolean downVote = false;
                if(!type.equals("All")){
                    int voteForPost = getVoteForPost(eachValue.getUserId(), eachValue.getPostId());
                    if (voteForPost == 1){
                        upVote = true;
                    }else if (voteForPost == -1) {
                        downVote = true;
                    }
                }
                PostResponse postResponse = PostResponse
                        .builder()
                        .id(eachValue.getPostId())
                        .postName(eachValue.getPostName())
                        .url(eachValue.getUrl())
                        .description(eachValue.getDescription())
                        .userName(getPostUserName(eachValue.getUserId()))
                        .subredditName(getSubRedditName(eachValue.getSubredditId()))
                        .voteCount(eachValue.getVoteCount())
                        .commentCount(getCommentCount(eachValue.getPostId()))
                        .upVote(upVote)
                        .downVote(downVote)
                        .createdDate(eachValue.getCreatedDate())
                        .build();
                postResponsesList.add(postResponse);
            }
        return postResponsesList;
    }

    public Integer getCommentCount(String postId){
        try {
            return commentRepository.findBypostId(postId).size();
        }catch (Exception e){
            throw new SpringRedditException(e.getMessage()+" comment Count");
        }
    }
    public String getPostUserName(String userId){
        try {
            return userRepository.findById(userId).get().getUsername() ;
        }catch (Exception e){
            throw new SpringRedditException(e.getMessage()+" UserName");
        }
    }
    public String getSubRedditName(String subredditId){
        try {
            return subredditRepository.findById(subredditId).get().getSubRedditName();
        }catch (Exception e){
            throw new SpringRedditException(e.getMessage()+" Subreddit Name");
        }
    }

    public int getVoteForPost(String userId, String postId){
        List<Vote> votesByuserIdAndpostId = votesWithMongoTemplate.getVotesByuserIdAndpostId(userId, postId);

        for (Vote eachVote: votesByuserIdAndpostId){
            if (eachVote.getVoteType() != null) {
                if (eachVote.getVoteType() == 1){
                    return 1;
                }else if (eachVote.getVoteType()==-1){
                    return -1;
                }
            }
        }
        return 0;
    }

}
