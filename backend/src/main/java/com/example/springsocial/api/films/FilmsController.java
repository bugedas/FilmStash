package com.example.springsocial.api.films;

import com.example.springsocial.api.exceptionHandling.exceptions.CustomDataNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/api/films")
public class FilmsController {

    private final FilmRepository filmRepository;

    public FilmsController(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    @GetMapping
    public List<Film> getFilms() {
        return filmRepository.findAll();
    }

    @GetMapping("/{id}")
    public List<Film> getFilmsByUser(@PathVariable Long id) {
        List<Film> allFilms = filmRepository.findAll();
        List<Film> filmsByUser = new ArrayList<>();
        for (Film f : allFilms
        ) {
            if (f.getUserId().equals(id)) {
                filmsByUser.add(f);
            }
        }
        return filmsByUser;
    }

    @GetMapping("/{uid}/{fid}")
    public Film getFilmByUserAndFilm(@PathVariable Long uid, @PathVariable String fid) {
        List<Film> filmsByUser = getFilmsByUser(uid);
        Film film = new Film();
        for (Film f : filmsByUser
        ) {
            if (f.getFilmId().equals(fid)) {
                film = f;
            }
        }
        if (film.getFilmId().equals("")) {
            throw new CustomDataNotFoundException("User of ID = " + uid + " has not added a film of ID = " + fid);
        }
        return film;
    }

    @PostMapping("/add")
    public ResponseEntity createFilm(@RequestBody Film film) throws URISyntaxException {
        Film savedFilm = filmRepository.save(film);
        return ResponseEntity.created(new URI("/api/films/" + savedFilm.getId())).body(savedFilm);
    }

    @PutMapping("/{id}")
    public ResponseEntity updateFilm(@PathVariable Long id, @RequestBody Film film) {
        Film currentFilm = filmRepository.findById(id).orElseThrow(() -> new CustomDataNotFoundException("Film of ID = " + id + " does not exist"));
        currentFilm.setFilmId(film.getFilmId());
        currentFilm.setUserId(film.getUserId());
        currentFilm.setTitle(film.getTitle());
        currentFilm.setFullTitle(film.getFullTitle());
        currentFilm.setYear(film.getYear());
        currentFilm.setImage(film.getImage());
        currentFilm.setCrew(film.getCrew());
        currentFilm.setImdbRating(film.getImdbRating());
        currentFilm.setImdbRatingCount(film.getImdbRatingCount());
        currentFilm.setType(film.getType());
        currentFilm.setUserRated(film.getUserRated());
        currentFilm.setListType(film.getListType());
        currentFilm.setRankNr(film.getRankNr());
        currentFilm = filmRepository.save(film);

        return ResponseEntity.ok(currentFilm);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteFilm(@PathVariable Long id) {
        try {
            filmRepository.deleteById(id);
        } catch (Exception e) {
            throw new CustomDataNotFoundException("Film of ID = " + id + " does not exist");
        }
        return ResponseEntity.ok().build();
    }
}
