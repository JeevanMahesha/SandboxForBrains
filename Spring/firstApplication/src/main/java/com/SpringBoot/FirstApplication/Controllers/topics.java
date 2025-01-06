package com.SpringBoot.FirstApplication.Controllers;

import com.SpringBoot.FirstApplication.Services.topic;
import com.SpringBoot.FirstApplication.Services.topicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class topics {

    @Autowired
    private topicService topicsData;

    @RequestMapping("/topics")
    public List<topic> getAllTopicsData(){
        return topicsData.getAllTopics();
    }

    @RequestMapping("/topics/{id}")
    public topic getTopic(@PathVariable String id){
        return topicsData.getOneTopic(id);
    }

    @RequestMapping(method = RequestMethod.POST,value = "/topics")
    public  void  addTopic(@RequestBody topic newTopic){
        topicsData.addNewTopic(newTopic);
    }

    @RequestMapping(method = RequestMethod.PUT,value = "/topics/{id}")
    public  void  updateTopic(@RequestBody topic updateTopic,@PathVariable String id){
        topicsData.updateTheTopic(updateTopic,id);
    }

    @RequestMapping(method = RequestMethod.DELETE,value = "/topics/{id}")
    public  void  deleteTopic(@PathVariable String id){
        topicsData.deleteTheTopic(id);
    }
}
