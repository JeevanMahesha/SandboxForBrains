package com.RedditClone.SpringBootAngular.Repository;


import com.RedditClone.SpringBootAngular.DTO.SubredditDTO;
import com.RedditClone.SpringBootAngular.Models.SubReddit;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubredditRepository extends
        MongoRepository<SubReddit,String>
{
    Optional<SubReddit> findBySubRedditName(String subRedditName);


}
