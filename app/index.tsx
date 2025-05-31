import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BusinessApp from './BusinessApp/index';
import TourismApp from './TourismApp/index';
import TouristApp from './TouristApp/index';

const CURRENT_APP: 'business' | 'tourism' | 'tourist' = 'tourism';

export default function App() {
    switch (CURRENT_APP) {
        case 'business':
            return <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, height: '100%' }}>
                    <BusinessApp />
                </SafeAreaView>
            </SafeAreaProvider>;
        case 'tourism':
            return <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, height: '100%' }}>
                    <TourismApp />
                </SafeAreaView>
            </SafeAreaProvider>;
        case 'tourist':
            return <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, height: '100%' }}>
                    <TouristApp />
                </SafeAreaView>
            </SafeAreaProvider>;
        default:
            return <div>Invalid app selection</div>;
    }
};

