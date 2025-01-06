package com.RedditClone.SpringBootAngular.Config;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UtilityFunctions {
    public String generateID(String idFor){
        return idFor + Integer.toString(new Random().nextInt(9999));
    }

    public Integer voteType(String type){
        if (type.equals("DOWNVOTE")) {
            return -1;
        }else if (type.equals("UPVOTE")) {
            return 1;
        }
        return 0;
    }
}


