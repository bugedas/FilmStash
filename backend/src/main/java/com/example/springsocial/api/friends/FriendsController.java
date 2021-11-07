package com.example.springsocial.api.friends;

import com.example.springsocial.api.exceptionHandling.exceptions.CustomDataNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendsController {

    private final FriendRepository friendRepository;

    public FriendsController(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    @GetMapping
    public List<Friend> getFriends() {
        return friendRepository.findAll();
    }

    @GetMapping("/{id}")
    public Friend getFriend(@PathVariable Long id) {
        return friendRepository.findById(id).orElseThrow(() -> new CustomDataNotFoundException("Friends relation of ID = " + id + " does not exist"));
    }

    @GetMapping("/user/{id}")
    public List<Friend> getFriendsByUser(@PathVariable Long id) {
        List<Friend> allFriends = friendRepository.findAll();
        List<Friend> friendsByUser = new ArrayList<>();
        for (Friend f : allFriends
        ) {
            if (f.getFollowingId().equals(id)) {
                friendsByUser.add(f);
            }
        }
        return friendsByUser;
    }

    @PostMapping("/add")
    public ResponseEntity createFriend(@RequestBody Friend friend) throws URISyntaxException {
        Friend savedFriend = friendRepository.save(friend);
        return ResponseEntity.created(new URI("/friends/" + savedFriend.getId())).body(savedFriend);
    }

    @PutMapping("/{id}")
    public ResponseEntity updateFriend(@PathVariable Long id, @RequestBody Friend friend) {
        Friend currentFriend = friendRepository.findById(id).orElseThrow(() -> new CustomDataNotFoundException("Friends relation of ID = " + id + " does not exist"));
        currentFriend.setFollowingId(friend.getFollowingId());
        currentFriend.setFollowedId(friend.getFollowedId());
        currentFriend = friendRepository.save(friend);

        return ResponseEntity.ok(currentFriend);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteFriend(@PathVariable Long id) {
        try {
            friendRepository.deleteById(id);
        } catch (Exception e) {
            throw new CustomDataNotFoundException("Friends relation of ID = " + id + " does not exist");
        }
        return ResponseEntity.ok().build();
    }

}
