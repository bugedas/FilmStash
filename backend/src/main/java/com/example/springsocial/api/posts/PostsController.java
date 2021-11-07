package com.example.springsocial.api.posts;

import com.example.springsocial.api.exceptionHandling.exceptions.CustomDataNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/api/posts")
public class PostsController {

    private final PostRepository postRepository;

    public PostsController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Post> getPosts() {
        return postRepository.findAll();
    }

    @GetMapping("/{id}")
    public Post getPost(@PathVariable Long id) {
        return postRepository.findById(id).orElseThrow(() -> new CustomDataNotFoundException("Post of ID = " + id + " does not exist"));
    }

    @GetMapping("/user/{id}")
    public List<Post> getPostsByUserId(@PathVariable Long id) {
        List<Post> allPosts = postRepository.findAll();
        List<Post> postsByUser = new ArrayList<>();
        for (Post p : allPosts
        ) {
            if (p.getUserId().equals(id)) {
                postsByUser.add(p);
            }
        }
        return postsByUser;
    }

    @PostMapping("/add")
    public ResponseEntity createPost(@RequestBody Post post) throws URISyntaxException {
        Post savedPost = postRepository.save(post);
        return ResponseEntity.created(new URI("/posts/" + savedPost.getId())).body(savedPost);
    }

    @PutMapping("/{id}")
    public ResponseEntity updatePost(@PathVariable Long id, @RequestBody Post post) {
        Post currentPost = postRepository.findById(id).orElseThrow(() -> new CustomDataNotFoundException("Post of ID = " + id + " does not exist"));
        currentPost.setUserId(post.getUserId());
        currentPost.setFilmId(post.getFilmId());
        currentPost.setMessage(post.getMessage());
        currentPost.setLikes(post.getLikes());
        currentPost.setDate(post.getDate());
        currentPost = postRepository.save(post);

        return ResponseEntity.ok(currentPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deletePost(@PathVariable Long id) {
        try {
            postRepository.deleteById(id);
        } catch (Exception e) {
            throw new CustomDataNotFoundException("Post of ID = " + id + " does not exist");
        }
        return ResponseEntity.ok().build();
    }

}
