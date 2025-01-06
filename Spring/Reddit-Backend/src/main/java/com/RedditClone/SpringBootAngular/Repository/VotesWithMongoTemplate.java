package com.RedditClone.SpringBootAngular.Repository;

import com.RedditClone.SpringBootAngular.Models.Vote;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@AllArgsConstructor
public class VotesWithMongoTemplate implements VotesImpls {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<Vote> getVotesByuserIdAndpostId(String userId, String postId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId).and("postId").is(postId));
        return new ArrayList<>(mongoTemplate.find(query,Vote.class));
    }
}
