import { Text, View } from 'react-native';

type PhotosProps = {
  roomId: string | number;
};

const Photos = ({ roomId }: PhotosProps) => {
  return (
    <View>
      <Text>Photos</Text>
    </View>
  )
};

export default Photos