import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Alert
} from 'react-native';

const ADIVINANZAS = [
  {
    id: 1,
    adivinanza: 'Soy un robot que ama los cigarros y la cerveza. ¿Quién soy?',
    respuesta: 'Bender Bending Rodríguez',
    opciones: ['Bender Bending Rodríguez', 'Philip J. Fry', 'Profesor Farnsworth', 'Hermes']
  },
  {
    id: 2,
    adivinanza: 'Vengo del siglo XX y soy aprendiz de repartidor en Planet Express. ¿Quién soy?',
    respuesta: 'Philip J. Fry',
    opciones: ['Leela', 'Philip J. Fry', 'Bender', 'Amy Wong']
  },
  {
    id: 3,
    adivinanza: 'Tengo un ojo único y soy capitana de la nave Planet Express. ¿Quién soy?',
    respuesta: 'Leela',
    opciones: ['Leela', 'Amy Wong', 'Zoidberg', 'Hermes']
  },
  {
    id: 4,
    adivinanza: 'Soy el dueño de Planet Express y tengo 160 años. ¿Quién soy?',
    respuesta: 'Profesor Farnsworth',
    opciones: ['Profesor Farnsworth', 'Mr. Burns', 'Scruffy', 'Zoidberg']
  },
  {
    id: 5,
    adivinanza: 'Soy un camarógrafo alienígena que ama la comida terrestre. ¿Quién soy?',
    respuesta: 'Zoidberg',
    opciones: ['Kif', 'Zoidberg', 'Lrr', 'Jrrr']
  },
  {
    id: 6,
    adivinanza: 'Soy la asistente del Profesor y trabajo en Planet Express. ¿Quién soy?',
    respuesta: 'Amy Wong',
    opciones: ['Amy Wong', 'Leela', 'Lela', 'Hermes']
  },
  {
    id: 7,
    adivinanza: 'Soy un burócrata que amo la salsa de tomate y conozco todos los códigos. ¿Quién soy?',
    respuesta: 'Hermes',
    opciones: ['Hermes', 'Zoidberg', 'Bender', 'Scruffy']
  },
  {
    id: 8,
    adivinanza: 'Soy novia de Fry en algunos episodios. ¿Quién soy?',
    respuesta: 'Leela',
    opciones: ['Leela', 'Amy', 'Michelle', 'Lrrr']
  }
];

export default function Adivinanzas() {
  const [indiceActual, setIndiceActual] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [respondidas, setRespondidas] = useState(0);
  const [respondioActual, setRespondioActual] = useState(false);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);
  const [loading, setLoading] = useState(false);

  const adivinanzaActual = ADIVINANZAS[indiceActual];
  const opcionesDesordenadas = [...adivinanzaActual.opciones].sort(() => Math.random() - 0.5);

  const verificarRespuesta = (respuesta) => {
    setRespondioActual(true);
    setLoading(true);
    
    setTimeout(() => {
      const esCorrecta = respuesta === adivinanzaActual.respuesta;
      setRespuestaCorrecta(esCorrecta);
      
      if (esCorrecta) {
        setPuntos(puntos + 10);
        Alert.alert('¡Correcto! 🎉', `¡Acertaste! Era ${adivinanzaActual.respuesta}`);
      } else {
        Alert.alert('Incorrecto ❌', `La respuesta era: ${adivinanzaActual.respuesta}`);
      }
      setLoading(false);
    }, 300);
  };

  const siguienteAdivinanza = () => {
    if (indiceActual < ADIVINANZAS.length - 1) {
      setIndiceActual(indiceActual + 1);
      setRespondidas(respondidas + 1);
      setRespondioActual(false);
      setRespuestaCorrecta(false);
    } else {
      Alert.alert(
        '¡Juego Terminado! 🎮',
        `Tu puntuación final: ${puntos + (respuestaCorrecta ? 10 : 0)} / ${ADIVINANZAS.length * 10}`,
        [
          {
            text: 'Jugar de nuevo',
            onPress: () => {
              setIndiceActual(0);
              setPuntos(0);
              setRespondidas(0);
              setRespondioActual(false);
              setRespuestaCorrecta(false);
            }
          }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>🧩 Adivina el Personaje</Text>
      
      {/* Puntuación */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Puntos</Text>
          <Text style={styles.scoreValue}>{puntos}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Progreso</Text>
          <Text style={styles.scoreValue}>{respondidas + 1}/{ADIVINANZAS.length}</Text>
        </View>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((respondidas + 1) / ADIVINANZAS.length) * 100}%` }
          ]}
        />
      </View>

      {/* Adivinanza */}
      <View style={styles.adivinanzaContainer}>
        <Text style={styles.numeroAdivinanza}>Adivinanza #{respondidas + 1}</Text>
        <Text style={styles.adivinanzaTexto}>{adivinanzaActual.adivinanza}</Text>
      </View>

      {/* Opciones */}
      <View style={styles.opcionesContainer}>
        {opcionesDesordenadas.map((opcion, index) => {
          let esCorrecta = opcion === adivinanzaActual.respuesta;
          let esSeleccionada = respondioActual && opcion === adivinanzaActual.respuesta;
          
          let backgroundColor = styles.opcionNormal.backgroundColor;
          
          if (respondioActual) {
            if (esCorrecta) {
              backgroundColor = '#4CAF50'; // Verde
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.opcion,
                { backgroundColor },
                respondioActual && !esCorrecta && opcion !== adivinanzaActual.respuesta && styles.opcionDeshabilitada
              ]}
              onPress={() => !respondioActual && verificarRespuesta(opcion)}
              disabled={respondioActual}
            >
              <Text style={styles.opcionTexto}>{opcion}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botón siguiente */}
      {respondioActual && (
        <TouchableOpacity style={styles.botonSiguiente} onPress={siguienteAdivinanza}>
          <Text style={styles.botonSiguienteTexto}>
            {indiceActual < ADIVINANZAS.length - 1 ? 'Siguiente ➜' : 'Ver Resultado Final'}
          </Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    padding: 16,
    paddingTop: 30
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6C63FF',
    textAlign: 'center',
    marginBottom: 20
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  scoreBox: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8
  },
  scoreLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 6
  },
  scoreValue: {
    color: '#6C63FF',
    fontSize: 24,
    fontWeight: 'bold'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a3e'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF'
  },
  adivinanzaContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a3e'
  },
  numeroAdivinanza: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12
  },
  adivinanzaTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26
  },
  opcionesContainer: {
    marginBottom: 20
  },
  opcion: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2a2a3e'
  },
  opcionNormal: {
    backgroundColor: '#1A1A2E'
  },
  opcionDeshabilitada: {
    opacity: 0.5
  },
  opcionTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  botonSiguiente: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40
  },
  botonSiguienteTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40
  }
});
