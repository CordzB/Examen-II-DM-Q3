import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import styles from '../styles';
import { useProducts } from '../context/ProductsContext';
import ProductItem from '../components/ProductItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function ListaScreen() {
  const { productos, cargando, cargar } = useProducts();
  const nav = useNavigation();

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => nav.navigate('Crear')}>
        <Text style={styles.buttonText}>+ Agregar producto</Text>
      </TouchableOpacity>

      {cargando ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProductItem producto={item} />}
          onRefresh={cargar}
          refreshing={cargando}
          ListEmptyComponent={<Text>No hay productos</Text>}
        />
      )}
    </View>
  );
}
