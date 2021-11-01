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
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import axios from '../../services/axios';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Animal = ({route}) => {
  const navigation = useNavigation();
  const statusInputRef = useRef<TextInput>();

  const animal = route.params?.animal || {};

  const [name, setName] = useState(animal.nome || '');
  const [status, setStatus] = useState(`${animal.statusAnimal}`);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    try {
      setLoading(true);
      await axios.post('/animals', {
        fid: animal.fid,
        nome: name,
        statusAnimal: status,
      });
      navigation.navigate('AnimalsList' as never);
    } catch (e) {
      Toast.show({
        type: 'error',
        text2: e?.response?.data?.message || e?.message,
      });
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <View>
          <Input
            label="Nome"
            onSubmitEditing={() => statusInputRef.current?.focus()}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={setName}
            value={name}
          />
          <Input
            label="Status"
            ref={statusInputRef}
            onSubmitEditing={save}
            onChangeText={setStatus}
            value={status}
          />

          <View>
            <Text style={styles.info}>
              <Text style={styles.strong}>Localização:</Text>{' '}
              {animal.localizacao}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.strong}>Raça:</Text> {animal.raca}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.strong}>Tipo:</Text> {animal.tipoAnimal}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.strong}>Código de Rastreamento:</Text>{' '}
              {animal.codigoRastreamento}
            </Text>
          </View>
        </View>

        {!loading ? (
          <Button onPress={save}>SALVAR</Button>
        ) : (
          <ActivityIndicator size="large" color="#FFD700" />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  info: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 26,
  },
  strong: {
    fontWeight: 'bold',
  },
});

export default Animal;
