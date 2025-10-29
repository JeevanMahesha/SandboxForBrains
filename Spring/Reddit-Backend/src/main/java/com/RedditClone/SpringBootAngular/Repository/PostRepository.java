package com.RedditClone.SpringBootAngular.Repository;

import com.RedditClone.SpringBootAngular.Models.Posts;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository

public interface PostRepository extends MongoRepository<Posts,String> {

    List<Posts> findByuserId(String currentUser);
    List<Posts> findBysubredditId(String subRedditId);
}
