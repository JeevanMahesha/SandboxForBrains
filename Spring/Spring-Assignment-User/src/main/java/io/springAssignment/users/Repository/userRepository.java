package io.springAssignment.users.Repository;

import io.springAssignment.users.Models.userModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface userRepository extends
        CrudRepository<userModel, Long>,
        PagingAndSortingRepository<userModel, Long> {

    Optional<userModel> findById(long id);




}
