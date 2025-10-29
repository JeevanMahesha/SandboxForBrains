package io.application.user.mongodb.Repository;


import io.application.user.mongodb.Models.UsersModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UsersRepository extends
        MongoRepository<UsersModel, Long> ,
        PagingAndSortingRepository<UsersModel,Long> {

}
