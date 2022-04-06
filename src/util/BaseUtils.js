export const parseTime = (time) => {
    const matcher = time.match(/(.*)T(..:..):.*/);
    return `${matcher[1]} ${matcher[2]}`;
}

export const filmTvLink = (media) => {
    if (media === 'tv') {
        return 'tv';
    }
    return 'film';
}

export const getMatchingTvs = (listOne, listTwo) => {
    const matchingTvIds = listOne.map(tvOne => listTwo.find(tvTwo => tvOne.tvId === tvTwo.tvId))
        .filter(tv => tv).map(tv => tv.tvId);
    const uniqueMatching = [...new Set(matchingTvIds)];
    const myMatchingTvs = uniqueMatching.map(matchId => listOne.find(tvOne => tvOne.tvId === matchId));
    const friendMatchingTvs = uniqueMatching.map(matchId => listTwo.find(tvTwo => tvTwo.tvId === matchId));
    return {myMatchingTvs, friendMatchingTvs};
}

export const selectStylesOnDark = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? '#e0e0e0' : '#2b2929',
        backgroundColor: state.isSelected ? '#969696' : '#e0e0e0',
    }),
    control: (provided, state) => ({
        ...provided,
        border: '3px solid #444444',
        borderRadius: '10px',
        color: '#e0e0e0',
        '&:hover': {
            borderColor: state.isFocused && '#444444'
        },
        boxShadow: state.isFocused && '0 0 0 1px red',
        backgroundColor: '#e0e0e0',
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: '#2b2929',
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#e0e0e0',
    })
}

export const selectStylesOnWhite = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#969696' : '#e0e0e0',
    }),
}