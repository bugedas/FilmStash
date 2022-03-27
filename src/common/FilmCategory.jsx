import {useEffect, useState} from "react";
import {tmdbGetRequest} from "../axios-wrapper";
import FilmCard from "./FilmCard";
import {tmdbImageLink} from "../constant/constants";
import './FilmCategory.scss';

export default function FilmCategory(props) {
    const [films, setFilms] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const tmdbData = await tmdbGetRequest(`${props.url}?`);
            setFilms(tmdbData.data.results);
        }

        getData();
    }, []);

    if(!films) {
        return null;
    }

    return(
        <div className={'film-category-container'}>
            <div className={'film-category-header'}>{props.category}</div>
            <div className={'film-category-content-container'}>
                {films.map(film => {
                    return <FilmCard key={film.id} image={tmdbImageLink(film.poster_path, 'w300')} title={film.title || film.name} filmId={film.id} filmType={film.media_type}/>
                })}
            </div>
        </div>
    )
}