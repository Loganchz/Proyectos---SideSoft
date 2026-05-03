import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CryptoItem from '../components/CryptoItem';
import { getTopCryptos } from '../services/coinmarketcap';

export default function HomeScreen({ navigation }) {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const data = await getTopCryptos();
      setCryptos(data);
    } catch (err) {
      setError('Error al cargar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Cargando criptomonedas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cryptos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CryptoItem
            item={item}
            onPress={() => navigation.navigate('Detail', { crypto: item })}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  list: {
    padding: 12,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 8,
    color: '#475569',
  },
  error: {
    color: '#b91c1c',
    textAlign: 'center',
  },
});
