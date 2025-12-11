import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './src/supabase';
import { Text, View, Button, TextInput, Alert, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const signUpOrIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error?.message.includes('Invalid login')) {
      await supabase.auth.signUp({ email, password });
      Alert.alert('Check your email to confirm!');
    }
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>LMS – Last Man Standing</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <Button title="Sign up / Sign in" onPress={signUpOrIn} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {() => (
            <View style={styles.container}>
              <Text style={styles.title}>Welcome {session.user.email}!</Text>
              <Text style={{fontSize: 20, marginVertical: 30}}>Your Premier League Last Man Standing app is LIVE!</Text>
              <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, marginBottom: 15, borderRadius: 10 }
});
