package com.SpringBoot.FirstApplication.Services;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class topicService {

    private List<topic> topics = new ArrayList<>(Arrays.asList(
            new topic("1","Test-1","description-1"),
            new topic("2","Test-2","description-2"),
            new topic("3","Test-3","description-3"),
            new topic("4","Test-4","description-4")

    ));

    public List<topic> getAllTopics() {
        return topics;
    }

    public  topic getOneTopic(String id){
        return topics.stream().filter(eachTopic->eachTopic.getId().equals(id)).findFirst().get();
    }

    public void addNewTopic(topic newTopic) {
        topics.add(newTopic);
    }

    public void updateTheTopic(topic updateTopic, String id) {
        for (int i = 0; i < topics.size() ; i++) {
            if (topics.get(i).getId().equals(id)) {
                    topics.set(i,updateTopic);
                    return;
            }
        }
    }

    public void deleteTheTopic(String id) {
        topics.removeIf(eachTopic->eachTopic.getId().equals(id));

    }
}
