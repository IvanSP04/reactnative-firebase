import { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet,
  ActivityIndicator, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Detail() {
  const route = useRoute();
  const navigation = useNavigation();
  const id = route.params?.id;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`https://futuramaapi.com/api/characters/${id}`)
      .then(r => r.json())
      .then(data => { setCharacter(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const guardarFavorito = async () => {
    const user = auth.currentUser;
    if (!user || !character) return;
    const q = query(
      collection(db, 'favoritos'),
      where('user_id', '==', user.uid),
      where('character_id', '==', character.id)
    );
    const existing = await getDocs(q);
    if (!existing.empty) { Alert.alert('Info', 'Ya está en favoritos'); return; }
    await addDoc(collection(db, 'favoritos'), {
      user_id: user.uid,
      character_id: character.id,
      character_name: character.name,
      character_image: character.image || '',
      creadoEn: new Date()
    });
    Alert.alert('✅', 'Guardado en favoritos');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>No se encontró el personaje.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: character.image || 'https://via.placeholder.com/200' }}
        style={styles.image}
      />

      <Text style={styles.name}>{character.name}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{character.species || 'Especie desconocida'}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Género</Text>
        <Text style={styles.value}>{character.gender || 'N/A'}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Ocupación</Text>
        <Text style={styles.value}>{character.occupation || 'N/A'}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Origen</Text>
        <Text style={styles.value}>{character.homePlanet || 'N/A'}</Text>
      </View>

      <TouchableOpacity style={styles.favBtn} onPress={guardarFavorito}>
        <Text style={styles.favText}>⭐ Guardar en favoritos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A', padding: 20, paddingTop: 50 },
  center: { flex: 1, backgroundColor: '#0D0D1A', justifyContent: 'center', alignItems: 'center' },
  back: { marginBottom: 16 },
  backText: { color: '#6C63FF', fontSize: 16 },
  image: {
    width: 200, height: 200, borderRadius: 100,
    alignSelf: 'center', backgroundColor: '#1A1A2E', marginBottom: 20
  },
  name: {
    color: '#fff', fontSize: 26, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 10
  },
  badge: {
    backgroundColor: '#6C63FF', borderRadius: 20,
    alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, marginBottom: 20
  },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  infoBox: {
    backgroundColor: '#1A1A2E', borderRadius: 10,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#2a2a3e'
  },
  label: { color: '#888', fontSize: 12, marginBottom: 4 },
  value: { color: '#fff', fontSize: 15, fontWeight: '600' },
  favBtn: {
    backgroundColor: '#6C63FF', borderRadius: 10,
    padding: 15, alignItems: 'center', marginTop: 10, marginBottom: 40
  },
  favText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});