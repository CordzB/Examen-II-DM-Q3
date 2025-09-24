import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../context/ProductsContext';

export default function ProductItem({ producto }) {
  const nav = useNavigation();
  const { eliminar } = useProducts();

  return (
    <View style={styles.item}>
      <Text style={styles.name}>{producto.nombre} — L {producto.precio}</Text>
      <Text>{producto.categoria} · {producto.estado}</Text>
      <Text numberOfLines={2}>{producto.descripcion}</Text>
      {!!producto.url_fotografia && <Image source={{ uri: producto.url_fotografia }} style={styles.image} />}

      <View style={[styles.row, { marginTop:8 }]}>
        <TouchableOpacity style={styles.button} onPress={() => nav.navigate('Detalle', { id: producto.id })}>
          <Text style={styles.buttonText}>Detalle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.danger]} onPress={() => eliminar(producto.id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
