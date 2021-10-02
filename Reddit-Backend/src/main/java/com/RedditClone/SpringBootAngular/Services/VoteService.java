package com.RedditClone.SpringBootAngular.Services;

import com.RedditClone.SpringBootAngular.AOP.SpringRedditException;
import com.RedditClone.SpringBootAngular.Config.UtilityFunctions;
import com.RedditClone.SpringBootAngular.DTO.VoteRequest;
import com.RedditClone.SpringBootAngular.Models.Posts;
import com.RedditClone.SpringBootAngular.Models.Vote;
import com.RedditClone.SpringBootAngular.Repository.PostRepository;
import com.RedditClone.SpringBootAngular.Repository.VoteRepository;
import com.RedditClone.SpringBootAngular.Repository.VotesWithMongoTemplate;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Service
@AllArgsConstructor
public class VoteService {

    private final PostRepository postRepository;
    private final AuthServices authServices;
    private final VoteRepository voteRepository;
    private final UtilityFunctions utilityFunctions;
    private final VotesWithMongoTemplate votesWithMongoTemplate;

    public String voteToPost(VoteRequest voteRequest) {
       Posts postsForVote = postRepository.findById(voteRequest.getPostId())
               .orElseThrow(()-> new SpringRedditException("Post Not Found"));
       String userId = authServices.getCurrentUser();
       if (userId.isEmpty()) {
            return "User Not Found";
        }

       int vote = utilityFunctions.voteType(voteRequest.getVoteType());

       List<Vote> voteDetails = votesWithMongoTemplate.getVotesByuserIdAndpostId(userId,voteRequest.getPostId());
       if (!voteDetails.isEmpty()){
           if (voteDetails.get(0).getVoteType() == vote) {
                return "You Have Already "+voteRequest.getVoteType()+" this post";
            }
            voteDetails.get(0).setVoteType(vote);
            voteRepository.save(voteDetails.get(0));
            updateVoteCountInPost(postsForVote,voteRequest);
            return "Voted For "+voteRequest.getPostId();
        }

        Vote newVote = new Vote();
        newVote.setVoteId(utilityFunctions.generateID("VOTE"));
        newVote.setVoteType(vote);
        newVote.setPostId(voteRequest.getPostId());
        newVote.setUserId(userId);
        voteRepository.insert(newVote);
        updateVoteCountInPost(postsForVote,voteRequest);
        return "Voted For "+voteRequest.getPostId();
    }

    private void updateVoteCountInPost(Posts postsForVote, VoteRequest voteRequest) {
        List<Vote> listOfVotes = voteRepository.findBypostId(voteRequest.getPostId());
        ArrayList<Integer> voteCount = new ArrayList<Integer>();
        listOfVotes.forEach(eachValue->voteCount.add(eachValue.getVoteType()));
        postsForVote.setVoteCount(voteCount.stream().mapToInt(Integer::intValue).sum());
        postRepository.save(postsForVote);
    }


}
