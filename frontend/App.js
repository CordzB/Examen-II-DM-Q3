import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsProvider } from './src/context/ProductsContext';
import ListaScreen from './src/screens/ListaScreen';
import CrearScreen from './src/screens/CrearScreen';
import DetalleScreen from './src/screens/DetalleScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ProductsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Lista" component={ListaScreen} options={{ title:'Productos' }} />
          <Stack.Screen name="Crear" component={CrearScreen} options={{ title:'Nuevo producto' }} />
          <Stack.Screen name="Detalle" component={DetalleScreen} options={{ title:'Detalle' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductsProvider>
  );
}
