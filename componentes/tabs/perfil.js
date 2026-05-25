import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';

export default function Perfil() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  const fetchFavoritos = async () => {
    if (!user) return;
    const q = query(collection(db, 'favoritos'), where('user_id', '==', user.uid));
    const snap = await getDocs(q);
    setFavoritos(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchFavoritos(); }, []);

  const eliminar = async (docId, nombre) => {
    Alert.alert('Eliminar', `¿Quitar a ${nombre} de favoritos?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'favoritos', docId));
          fetchFavoritos();
        }
      }
    ]);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Mis Favoritos</Text>
      <Text style={styles.email}>{user?.email}</Text>

      {favoritos.length === 0 ? (
        <Text style={styles.empty}>No tienes favoritos aún</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.docId}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.character_image || 'https://via.placeholder.com/60' }}
                style={styles.image}
              />
              <Text style={styles.name}>{item.character_name}</Text>
              <TouchableOpacity onPress={() => eliminar(item.docId, item.character_name)}>
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A', padding: 16, paddingTop: 50 },
  center: { flex: 1, backgroundColor: '#0D0D1A', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6C63FF', marginBottom: 4 },
  email: { color: '#666', fontSize: 13, marginBottom: 20 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 40 },
  card: {
    flexDirection: 'row', backgroundColor: '#1A1A2E',
    borderRadius: 12, marginBottom: 10, padding: 10,
    alignItems: 'center', borderWidth: 1, borderColor: '#2a2a3e'
  },
  image: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#333' },
  name: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 14 },
  delete: { fontSize: 22, paddingHorizontal: 8 },
  logoutBtn: {
    backgroundColor: '#333', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 10
  },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});
