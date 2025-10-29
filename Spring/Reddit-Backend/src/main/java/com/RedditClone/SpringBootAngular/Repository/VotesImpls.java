package com.RedditClone.SpringBootAngular.Repository;

import com.RedditClone.SpringBootAngular.Models.Vote;

import java.util.List;

public interface VotesImpls {

    List<Vote> getVotesByuserIdAndpostId(String userId,String postId);
}
