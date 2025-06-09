import { Redirect } from 'expo-router';

const CURRENT_APP: 'business' | 'tourism' | 'tourist' = 'tourism';

export default function App() {
  switch (CURRENT_APP) {
    case 'business':
      return <Redirect href="/BusinessApp" />;
    case 'tourism':
      return <Redirect href="/TourismCMS" />;
    case 'tourist':
      return <Redirect href="/TouristApp" />;
    default:
      return <Redirect href="/TourismCMS" />;
  }
}
