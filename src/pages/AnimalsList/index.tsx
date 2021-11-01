import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Touchable,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import axios from '../../services/axios';

const AnimalsListPage = () => {
  const navigation = useNavigation();

  const [listData, setListData] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState('');

  const filteredData = useMemo(() => {
    const filterStr = filter.toLowerCase();
    return listData.filter(item => {
      return (
        item.nome.toLowerCase().includes(filterStr) ||
        item.localizacao.toLowerCase().includes(filterStr)
      );
    });
  }, [listData, filter]);

  const setOfflineAnimals = useCallback(async () => {
    const animals = await AsyncStorage.getItem('@animals');
    if (animals) {
      setListData(JSON.parse(animals));
    }
  }, []);

  const fetchAnimals = useCallback(async () => {
    try {
      const {data} = await axios.get('/animals');
      setListData(data);
      await AsyncStorage.setItem('@animals', JSON.stringify(data));

      setLoading(false);
    } catch (e) {
      Toast.show({
        type: 'error',
        text2: e?.response?.data?.message || e?.message,
      });
    }
  }, []);

  const remove = async (fid: string) => {
    try {
      setRemoving(fid);
      await axios.delete('/animals', {
        params: {fid},
      });
      fetchAnimals();
    } catch (e) {
      Toast.show({
        type: 'error',
        text2: e?.response?.data?.message || e?.message,
      });
    } finally {
      setRemoving('');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@userData');
    navigation.reset({
      index: 0,
      routes: [{name: 'Login' as never}],
    });
  };

  const goTo = item => {
    navigation.navigate('Animal' as never, {animal: item} as never);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        activeOpacity={0.5}
        onPress={() => goTo(item)}>
        <View style={styles.listStart}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.nome.substring(0, 1)}</Text>
          </View>
          <View>
            <Text style={styles.title}>
              <Text style={styles.strong}>Nome:</Text> {item.nome}
            </Text>
            <Text style={styles.subtitle}>
              <Text style={styles.strong}>Localização:</Text> {item.localizacao}
            </Text>
          </View>
        </View>
        <View>
          {removing !== item.fid ? (
            <TouchableOpacity
              style={styles.delButton}
              onPress={() => remove(item.fid)}>
              <Text style={styles.delText}>DEL</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator color="red" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      setOfflineAnimals();
      fetchAnimals();
    }, [setOfflineAnimals, fetchAnimals]),
  );

  return (
    <View style={styles.container}>
      {!loading ? (
        <>
          <View style={styles.header}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              returnKeyType="search"
              onChangeText={setFilter}
              value={filter}
            />
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={logout}
              activeOpacity={0.6}>
              <Text style={styles.logoutText}>SAIR</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </>
      ) : (
        <ActivityIndicator size="large" color="#FFD700" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  header: {
    flexDirection: 'row',
  },
  logoutButton: {
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  logoutText: {
    fontWeight: '300',
  },
  searchInput: {
    backgroundColor: '#202020',
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listStart: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  avatar: {
    backgroundColor: '#252525',
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
  },
  strong: {
    fontWeight: 'bold',
  },
  delButton: {
    backgroundColor: '#B80F0A',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  delText: {
    fontWeight: '300',
    color: 'white',
  },
});

export default AnimalsListPage;
