import React from 'react';
import {FlatList, FlatListProps, Pressable, StyleSheet} from 'react-native';
import {DriverSwapRow, DriverSwapRowProps} from '../DriverSwapRow';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    height: 100,
  },
});

export interface DriverSwapsProps
  extends Omit<FlatListProps<DriverSwapRowProps>, 'renderItem'> {
  onSelectItem?: (item: DriverSwapRowProps, index: number) => void;
}

export const DriverSwaps: React.FC<DriverSwapsProps> = ({
  onSelectItem = () => {},
  ...props
}) => (
  <FlatList
    {...props}
    inverted
    ListFooterComponentStyle={styles.header}
    renderItem={({item, index}) => {
      return (
        <Pressable
          onPress={() => {
            onSelectItem(item, index);
          }}
        >
          <DriverSwapRow {...item} />
        </Pressable>
      );
    }}
  />
);

export default DriverSwaps;
