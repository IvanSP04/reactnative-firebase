import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://futuramaapi.com/api/characters?limit=30')
      .then(r => r.json())
      .then(data => {
        setCharacters(data.items || data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error:', error);
        Alert.alert('Error', 'No se pudo cargar la API');
        setLoading(false);
      });
  }, []);

  const guardarFavorito = async (character) => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'favoritos'),
      where('user_id', '==', user.uid),
      where('character_id', '==', character.id)
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      Alert.alert('Info', 'Ya está en favoritos');
      return;
    }

    await addDoc(collection(db, 'favoritos'), {
      user_id: user.uid,
      character_id: character.id,
      character_name: character.name,
      character_image: character.image || '',
      creadoEn: new Date()
    });
    Alert.alert('✅', `${character.name} guardado en favoritos`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={{ color: '#aaa', marginTop: 10 }}>Cargando personajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Personajes de Futurama</Text>
      <FlatList
        data={characters}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {}}
          >
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/80' }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.species}>{item.species || 'Especie desconocida'}</Text>
              <Text style={styles.gender}>{item.gender || ''}</Text>
            </View>
            <TouchableOpacity
              style={styles.favBtn}
              onPress={() => guardarFavorito(item)}
            >
              <Text style={{ fontSize: 22 }}>⭐</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A', padding: 16, paddingTop: 50 },
  center: { flex: 1, backgroundColor: '#0D0D1A', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6C63FF', marginBottom: 16 },
  card: {
    flexDirection: 'row', backgroundColor: '#1A1A2E',
    borderRadius: 12, marginBottom: 12, padding: 10,
    alignItems: 'center', borderWidth: 1, borderColor: '#2a2a3e'
  },
  image: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#333' },
  info: { flex: 1, marginLeft: 14 },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  species: { color: '#aaa', fontSize: 13, marginTop: 2 },
  gender: { color: '#666', fontSize: 12, marginTop: 2 },
  favBtn: { padding: 8 }
});