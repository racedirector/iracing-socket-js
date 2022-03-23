import React from 'react';
import {FlatList, FlatListProps, Pressable, StyleSheet} from 'react-native';
import {IncidentRow, IncidentRowProps} from 'components/IncidentRow';
import {IncidentHeader} from 'components/IncidentHeader';
import {Card} from 'components/Card';

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
  style,
  onSelectItem = () => {},
  ...props
}) => (
  <Card
    style={[styles.container, style]}
    title={`Incidents (${props.data.length})`}>
    <FlatList
      {...props}
      inverted
      ListFooterComponent={IncidentHeader}
      ListFooterComponentStyle={styles.header}
      renderItem={({item, index}) => {
        return (
          <Pressable
            onPress={() => {
              onSelectItem(item, index);
            }}>
            <IncidentRow
              key={`${item.driverName}-${item.weight}-${index}`}
              {...item}
            />
          </Pressable>
        );
      }}
    />
  </Card>
);

export default Incidents;
