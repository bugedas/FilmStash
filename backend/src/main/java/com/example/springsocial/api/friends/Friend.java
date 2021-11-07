package com.example.springsocial.api.friends;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "friend")
public class Friend {
    @Id
    @GeneratedValue
    private Long id;
    private Long followingId;
    private Long followedId;

    public Friend(Long followingId, Long followedId) {
        this.followingId = followingId;
        this.followedId = followedId;
    }

    public Friend() {
        this.followingId = null;
        this.followedId = null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFollowingId() {
        return followingId;
    }

    public void setFollowingId(Long followingId) {
        this.followingId = followingId;
    }

    public Long getFollowedId() {
        return followedId;
    }

    public void setFollowedId(Long followedId) {
        this.followedId = followedId;
    }
}
