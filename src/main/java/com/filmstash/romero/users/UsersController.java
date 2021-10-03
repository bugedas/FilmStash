package com.filmstash.romero.users;

import com.filmstash.romero.exceptionHandling.exceptions.CustomDataNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserRepository userRepository;

    public UsersController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new CustomDataNotFoundException("User of ID = " + id + " does not exist"));
    }

    @PostMapping("/add")
    public ResponseEntity createUser(User user) throws URISyntaxException {
        User savedUser = userRepository.save(user);
        return ResponseEntity.created(new URI("/users/" + savedUser.getId())).body(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity updateUser(@PathVariable Long id, User user) {
        User currentUser = userRepository.findById(id).orElseThrow(() -> new CustomDataNotFoundException("User of ID = " + id + " does not exist"));
        currentUser.setFirstName(user.getFirstName());
        currentUser.setLastName(user.getLastName());
        currentUser.setAge(user.getAge());
        currentUser.setUserName(user.getUserName());
        currentUser.setPassword(user.getPassword());
        currentUser.setEmail(user.getEmail());
        currentUser = userRepository.save(user);

        return ResponseEntity.ok(currentUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
        } catch (Exception e) {
            throw new CustomDataNotFoundException("User of ID = " + id + " does not exist");
        }
        return ResponseEntity.ok().build();
    }

}
