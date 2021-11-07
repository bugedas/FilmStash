package com.example.springsocial.api.posts;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Date;

@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    private String filmId;
    private Long userId;
    private String message;
    private int likes;
    private Date date;

    public Post(String filmId, Long userId, String message, int likes, Date date) {
        this.filmId = filmId;
        this.userId = userId;
        this.message = message;
        this.likes = likes;
        this.date = date;
    }

    public Post() {
        this.filmId = "";
        this.userId = null;
        this.message = "";
        this.likes = 0;
        this.date = null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilmId() {
        return filmId;
    }

    public void setFilmId(String filmId) {
        this.filmId = filmId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
