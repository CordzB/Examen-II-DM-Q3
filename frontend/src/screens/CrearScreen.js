import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import styles from '../styles';
import { useProducts } from '../context/ProductsContext';
import * as ImageManipulator from 'expo-image-manipulator';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function CrearScreen() {
  const { agregar } = useProducts();
  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState('Disponible');
  const [categoria, setCategoria] = useState('');
  const [foto, setFoto] = useState(null);
  const [abriendoCam, setAbriendoCam] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [perm, requestPerm] = useCameraPermissions();
  const camRef = useRef(null);

  const abrirCamara = async () => {
    if (!perm || !perm.granted) {
      const ok = await requestPerm();
      if (!ok?.granted) return Alert.alert('Permiso de cámara denegado');
    }
    setAbriendoCam(true);
  };

  const tomarFoto = async () => {
    if (!camRef.current) return;
    const photo = await camRef.current.takePictureAsync({ base64: true });
    const resized = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    setFoto(`data:image/jpeg;base64,${resized.base64}`);
    setAbriendoCam(false);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setEstado('Disponible');
    setCategoria('');
    setFoto(null);
  };

  const guardar = async () => {
    try {
      if (!nombre || !descripcion || !precio || !estado || !categoria) {
        return Alert.alert('Completa los campos obligatorios');
      }

      const norm = (estado || '').toLowerCase().trim();
      const estadoValido =
        norm === 'disponible' ? 'Disponible' :
        norm === 'no disponible' ? 'No disponible' : null;

      if (!estadoValido) {
        return Alert.alert('Estado inválido', 'Usa exactamente: "Disponible" o "No disponible".');
      }

      const precioNum = Number(precio);
      if (Number.isNaN(precioNum) || precioNum < 0) {
        return Alert.alert('Precio inválido', 'Ingresa un número válido (ej. 500 o 500.00).');
      }

      setGuardando(true);

      await agregar({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNum,
        estado: estadoValido,
        categoria: categoria.trim(),
        url_fotografia: foto || null
      });

      Alert.alert('Éxito', 'Producto creado ✅');
      limpiarFormulario();
      navigation.goBack(); // vuelve a la lista
    } catch (err) {
      console.log('ERROR al guardar:', err);
      Alert.alert('No se pudo guardar', String(err?.message || err));
    } finally {
      setGuardando(false);
    }
  };

  if (abriendoCam) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView ref={camRef} style={{ flex: 1 }} facing="back" />
        <TouchableOpacity style={[styles.button, { margin: 16 }]} onPress={tomarFoto}>
          <Text style={styles.buttonText}>Tomar foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.danger, { marginHorizontal: 16 }]}
          onPress={() => setAbriendoCam(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre *"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción *"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Precio *"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Estado (Disponible/No disponible) *"
        value={estado}
        onChangeText={setEstado}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoría *"
        value={categoria}
        onChangeText={setCategoria}
      />

      {foto && <Image source={{ uri: foto }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={abrirCamara} disabled={guardando}>
        <Text style={styles.buttonText}>Abrir cámara</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={guardar} disabled={guardando}>
        {guardando ? <ActivityIndicator /> : <Text style={styles.buttonText}>Guardar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
