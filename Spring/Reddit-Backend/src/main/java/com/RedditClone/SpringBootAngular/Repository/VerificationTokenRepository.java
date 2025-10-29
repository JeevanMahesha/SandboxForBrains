package com.RedditClone.SpringBootAngular.Repository;

import com.RedditClone.SpringBootAngular.Models.VerificationToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends MongoRepository<VerificationToken,String> {

    Optional<VerificationToken> findByToken(String token);
}
