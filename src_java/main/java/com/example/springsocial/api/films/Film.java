package com.example.springsocial.api.films;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "film")
public class Film {
    @Id
    @GeneratedValue
    private Long id;
    private String filmId;
    private Long userId;
    private int userRated;
    private String listType;
    private String fullTitle;
    private String year;
    private String image;
    private String crew;
    private String imdbRating;
    private String imdbRatingCount;
    private String title;
    private String rankNr;
    private String type;

    public Film(Long id, String filmId, Long userId, int userRated, String listType, String title, String fullTitle, String year, String image, String rankNr, String crew, String imdbRating, String imdbRatingCount, String type) {
        this.id = id;
        this.filmId = filmId;
        this.title = title;
        this.userId = userId;
        this.userRated = userRated;
        this.listType = listType;
        this.fullTitle = fullTitle;
        this.year = year;
        this.image = image;
        this.crew = crew;
        this.imdbRating = imdbRating;
        this.imdbRatingCount = imdbRatingCount;
        this.rankNr = rankNr;
        this.type = type;
    }

    public Film() {
        this.id = null;
        this.filmId = "";
        this.userId = null;
        this.userRated = 0;
        this.listType = "";
        this.title = "";
        this.fullTitle = "";
        this.year = "";
        this.image = "";
        this.rankNr = "";
        this.crew = "";
        this.imdbRating = "";
        this.imdbRatingCount = "";
        this.type = "";
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

    public int getUserRated() {
        return userRated;
    }

    public void setUserRated(int userRated) {
        this.userRated = userRated;
    }

    public String getListType() {
        return listType;
    }

    public void setListType(String listType) {
        this.listType = listType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFullTitle() {
        return fullTitle;
    }

    public void setFullTitle(String fullTitle) {
        this.fullTitle = fullTitle;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getRankNr() {
        return rankNr;
    }

    public void setRankNr(String rankNr) {
        this.rankNr = rankNr;
    }

    public String getCrew() {
        return crew;
    }

    public void setCrew(String crew) {
        this.crew = crew;
    }

    public String getImdbRating() {
        return imdbRating;
    }

    public void setImdbRating(String imdbRating) {
        this.imdbRating = imdbRating;
    }

    public String getImdbRatingCount() {
        return imdbRatingCount;
    }

    public void setImdbRatingCount(String imdbRatingCount) {
        this.imdbRatingCount = imdbRatingCount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


}
