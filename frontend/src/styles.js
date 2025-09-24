import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container:{ flex:1, padding:16, backgroundColor:'#fff' },
  input:{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:10 },
  button:{ backgroundColor:'#2e86de', padding:12, borderRadius:8, alignItems:'center', marginVertical:6 },
  buttonText:{ color:'#fff', fontWeight:'bold' },
  item:{ borderWidth:1, borderColor:'#eee', borderRadius:8, padding:12, marginBottom:10 },
  name:{ fontWeight:'bold', fontSize:16, marginBottom:4 },
  image:{ width:'100%', height:160, borderRadius:8, marginTop:8 },
  row:{ flexDirection:'row', gap:10 },
  danger:{ backgroundColor:'#c0392b' }
});
