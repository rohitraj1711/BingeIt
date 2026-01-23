import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../lib/AuthContext";
import { AuthGuard } from "../lib/AuthGuard";

type RootStackParamList = {
  Index: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

export default function SignUp({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (!email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Firebase signup error:', error);
      let errorMessage = "An error occurred. Please try again.";

      if (error.code) {
        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage = "Network error. Please check your internet connection and try again.";
            break;
          case 'auth/email-already-in-use':
            errorMessage = "This email is already registered. Please use a different email or sign in.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password should be at least 6 characters long.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Too many attempts. Please try again later.";
            break;
          default:
            errorMessage = error.message || "Failed to create account. Please try again.";
        }
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      if (error.code === '12501') {
        // User cancelled the sign-in
        return;
      }
      Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Binge It today</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, googleLoading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <Text style={styles.googleButtonText}>
              {googleLoading ? "Signing In..." : "Sign in with Google"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0f0f23",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ccc",
    marginBottom: 40,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7b2cbf",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#444",
  },
  dividerText: {
    color: "#888",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#7b2cbf",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
});