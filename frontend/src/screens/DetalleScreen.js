import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles';
import { useProducts } from '../context/ProductsContext';
import { useRoute } from '@react-navigation/native';

export default function DetalleScreen() {
  const route = useRoute();
  const id = route.params?.id;
  const { productos } = useProducts();
  const p = productos.find(x => x.id === id);

  if (!p) return <View style={styles.container}><Text>No encontrado</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{p.nombre}</Text>
      <Text>Precio: L {p.precio}</Text>
      <Text>Estado: {p.estado}</Text>
      <Text>Categoría: {p.categoria}</Text>
      <Text style={{ marginTop:8 }}>{p.descripcion}</Text>
      {!!p.url_fotografia && <Image source={{ uri: p.url_fotografia }} style={[styles.image, { marginTop:12 }]} />}
    </View>
  );
}
