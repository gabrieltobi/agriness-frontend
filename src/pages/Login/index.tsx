import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import Input from '../../components/Input';
import Button from '../../components/Button';
import axios from '../../services/axios';
import {isValidEmail} from '../../services/email';

const LoginPage = () => {
  const navigation = useNavigation();
  const passwordInputRef = useRef<TextInput>();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const submit = async () => {
    try {
      setLoading(true);

      if (!isValidEmail(user)) {
        throw Error('Informe um e-mail válido');
      } else if (password.length < 4) {
        throw Error('Senha muito curta');
      }

      const {data} = await axios.post('/login', {
        user,
        password,
      });

      await AsyncStorage.setItem('@userData', JSON.stringify(data));
      goToFirstPage();
    } catch (e) {
      Toast.show({
        type: 'error',
        text2: e?.response?.data?.message || e?.message,
      });
      setLoading(false);
    }
  };

  const goToFirstPage = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'AnimalsList' as never}],
    });
  };

  const checkUser = useCallback(async () => {
    const userData = await AsyncStorage.getItem('@userData');
    if (userData) {
      goToFirstPage();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <ImageBackground
      source={require('../../assets/images/login-bg.jpg')}
      resizeMode="cover"
      blurRadius={5}
      style={styles.image}>
      <View style={styles.container}>
        {!loading ? (
          <>
            <Input
              placeholder="E-mail"
              autoComplete="email"
              keyboardType="email-address"
              autoCapitalize="none"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={setUser}
              value={user}
            />
            <Input
              placeholder="Senha"
              secureTextEntry
              ref={passwordInputRef}
              onSubmitEditing={submit}
              onChangeText={setPassword}
              value={password}
            />

            <Button onPress={submit}>ACESSAR</Button>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#FFD700" />
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default LoginPage;
