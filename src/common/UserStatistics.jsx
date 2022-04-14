import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import MovieIcon from "@mui/icons-material/Movie";
import React from "react";
import './UserStatistics.scss';

export default function UserStatistics({userMetrics}) {
    return (
        <Accordion sx={{
            backgroundColor: '#333333',
            marginBottom: '20px',
            boxShadow: '0 0 15px black',
            color: '#e0e0e0'
        }}>
            <AccordionSummary
                sx={{borderBottom: '2px solid #f25c5c'}}
                expandIcon={<ExpandMoreIcon sx={{color: '#e0e0e0'}}/>}
            >
                User metrics
            </AccordionSummary>
            <AccordionDetails sx={{textAlign: 'left'}}>
                <div className={'metrics-statistics'}>
                    <div className={'metric'}>
                        <span className={'metric-name'}>User followers:</span>
                        <PeopleIcon sx={{marginLeft: '30px'}}/>
                        <span className={'metrics-number'}>{userMetrics?.followersCount}</span>
                    </div>
                    <div className={'metric'}>
                        <span className={'metric-name'}>User following:</span>
                        <PeopleIcon sx={{marginLeft: '30px'}}/>
                        <span className={'metrics-number'}>{userMetrics?.followingCount}</span>
                    </div>
                    <div className={'metric'}>
                        <span className={'metric-name'}>User posts:</span>
                        <LocalPostOfficeIcon sx={{marginLeft: '30px'}}/>
                        <span className={'metrics-number'}>{userMetrics?.myPostsCount}</span>
                    </div>
                    <div className={'metric'}>
                        <span className={'metric-name'}>User posts total like count:</span>
                        <FavoriteIcon sx={{marginLeft: '30px'}}/>
                        <span className={'metrics-number'}>{userMetrics?.myPostsLikeCount}</span>
                    </div>
                    <div className={'metric'}>
                        <span className={'metric-name'}>User commented count:</span>
                        <CommentIcon sx={{marginLeft: '30px'}}/>
                        <span className={'metrics-number'}>{userMetrics?.myCommentsCount}</span>
                    </div>
                    <div className={'metric'}>
                        <span className={'metric-name'}>Watching TV Series now:</span>
                        <MovieIcon sx={{marginLeft: '30px'}}/>
                        <span className={'metrics-number'}>{userMetrics?.watchingTvSeriesCount}</span>
                    </div>
                    <div className={'metric'}>
                        <span className={'metric-name'}>Finished TV Series:</span>
                        <MovieIcon sx={{marginLeft: '30px'}}/>
                        <span className={'metrics-number'}>{userMetrics?.watchedTvSeriesCount}</span>
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    );
}