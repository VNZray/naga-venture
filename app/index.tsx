import BusinessApp from './BusinessApp';
import TourismApp from './TourismApp'; // full web
import TouristApp from './TouristApp';

const CURRENT_APP: 'business' | 'tourism' | 'tourist' = 'tourist';

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
}
