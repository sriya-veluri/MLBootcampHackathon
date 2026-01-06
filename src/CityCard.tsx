import './CityCard.css'

type Props={
    location: string;
    value: number;
    status: string;
    timestamp: Date;
}

function CityCard ({location, value, status, timestamp}: Props) {
    return(
        <div className="header">
            <div className="status">

            </div>
        </div>
    );
}

export default CityCard;