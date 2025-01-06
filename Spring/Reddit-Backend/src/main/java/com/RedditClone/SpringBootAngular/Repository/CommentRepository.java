package com.RedditClone.SpringBootAngular.Repository;

import com.RedditClone.SpringBootAngular.Models.Comments;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comments,String> {
    List<Comments> findBypostId(String id);

    List<Comments> findByuserId(String id);
}
