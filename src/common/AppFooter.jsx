import React from 'react';
import './AppFooter.css';

export default function AppFooter() {
    return(
    <div className={'footer'}>
        <div className={'footer-wrapper'}>
            <ul>
                <li><a href={'/'}>HOME</a></li>
                <li><a href={'/profile'}>PROFILE</a></li>
            </ul>
        </div>
        <div className={'filmstash'}> FILMSTASH 2021</div>
    </div>
    )
}