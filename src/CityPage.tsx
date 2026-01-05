import './City.css';
import HomePage from './HomePage'
import React, { useState } from 'react';

type Props = {
    city: string;
    Back: () => void;
};

function CityPage({ city, Back }: Props) {
    return (
        <div className="center">
            <button className="btn" onClick={Back}> ← Back to Search</button>
            <h1>🌏 Air Quality Tracker</h1>
            <div className="container">
                <h1>{city}</h1>
            </div>
        </div>
    );
}

export default CityPage;