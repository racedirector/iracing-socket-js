import React, {useCallback} from 'react';
import {FlatList, FlatListProps, Pressable, StyleSheet} from 'react-native';
import {IncidentRow, IncidentRowProps} from '../IncidentRow';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    height: 100,
  },
});

export interface IncidentsProps
  extends Omit<FlatListProps<IncidentRowProps>, 'renderItem'> {
  onSelectItem?: (item: IncidentRowProps, index: number) => void;
}

export const Incidents: React.FC<IncidentsProps> = ({
  onSelectItem = () => {},
  ...props
}) => {
  const renderItem = useCallback(
    ({item, index}) => (
      <Pressable
        onPress={() => {
          onSelectItem(item, index);
        }}>
        <IncidentRow
          key={`${item.driverName}-${item.weight}-${index}`}
          {...item}
        />
      </Pressable>
    ),
    [onSelectItem],
  );

  return (
    <FlatList
      {...props}
      inverted
      ListFooterComponentStyle={styles.header}
      renderItem={renderItem}
    />
  );
};

export default Incidents;
