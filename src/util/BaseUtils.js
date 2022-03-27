export const parseTime = (time) => {
    const matcher = time.match(/(.*)T(..:..):.*/);
    return `${matcher[1]} ${matcher[2]}`;
}

export const filmTvLink = (media) => {
    console.log(media);
    if(media === 'tv'){
        return 'tv';
    }
    return 'film';
}

export const getMatchingTvs = (listOne, listTwo) => {
    const matchingTvIds = listOne.map(tvOne => listTwo.find(tvTwo => tvOne.tvId === tvTwo.tvId))
        .filter(tv => tv).map(tv => tv.tvId);
    const myMatchingTvs = matchingTvIds.map(matchId => listOne.find(tvOne => tvOne.tvId === matchId));
    const friendMatchingTvs = matchingTvIds.map(matchId => listTwo.find(tvTwo => tvTwo.tvId === matchId));
    return {myMatchingTvs, friendMatchingTvs};
}