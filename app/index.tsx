import BusinessApp from './BusinessApp/index';
import TourismApp from './TourismApp/index';
import TouristApp from './TouristApp/index';

const CURRENT_APP: 'business' | 'tourism' | 'tourist' = 'tourism';

export default function App() {
    switch (CURRENT_APP) {
        case 'business':
            return <BusinessApp />;
        case 'tourism':
            return <TourismApp />;
        case 'tourist':
            return <TouristApp />;
        default:
            return <div>Invalid app selection</div>;
    }
};

