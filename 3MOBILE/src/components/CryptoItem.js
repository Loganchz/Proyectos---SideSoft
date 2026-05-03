import { Pressable, StyleSheet, Text, View } from 'react-native';

function formatCurrency(value) {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatLargeNumber(value) {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CryptoItem({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.label}>#</Text>
        <Text style={styles.value}>{item.cmc_rank}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{`${item.symbol} - ${item.name}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Precio</Text>
        <Text style={styles.value}>{formatCurrency(item.quote?.USD?.price)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Capitalizacion</Text>
        <Text style={styles.value}>{formatLargeNumber(item.quote?.USD?.market_cap)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e4e7eb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#334155',
  },
  value: {
    color: '#0f172a',
    maxWidth: '65%',
    textAlign: 'right',
  },
});
