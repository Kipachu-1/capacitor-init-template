import { useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAtom } from "jotai";
import { authModalOpenAtom, sessionAtom, userAtom } from "@/state";
import {
  SignInWithApple,
  SignInWithAppleOptions,
} from "@capacitor-community/apple-sign-in";
import { App } from "@capacitor/app";
import GoogleAuthPlugin from "@/services/google";
import config from "@/config";

const getAppClientId = async () => {
  const info = await App.getInfo();
  const clientId = info?.id;
  return clientId;
};

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [session, setSession] = useAtom(sessionAtom);
  const [modalOpen, setModalOpen] = useAtom(authModalOpenAtom);

  const fetchUser = useCallback(async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Error refreshing session:", error);
      setUser(null);
      setSession(null);
      return;
    }
    if (data.session && data.user) {
      setSession(data.session);
      setUser(data.user);
      return;
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    setUser(data.user);
    setSession(data.session);
  };

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    setUser(data.user);
    setSession(data.session);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setUser(null);
    setSession(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const sendEmailOtp = async (email: string) => {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
  };

  const verifyEmailWithOtp = async (email: string, otp: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      throw new Error(error.message);
    }
    setUser(data.user);
    setSession(data.session);
  };

  const appleSignIn = async () => {
    const clientId = await getAppClientId();
    const options: SignInWithAppleOptions = {
      clientId: clientId,
      redirectURI: "/",
      scopes: "email name",
    };

    const { response } = await SignInWithApple.authorize(options);
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: response.identityToken,
    });
    if (error) {
      throw new Error(error.message);
    }
    setUser(data.user);
    setSession(data.session);
  };

  const googleSignIn = async () => {
    const response = await GoogleAuthPlugin.signIn({
      webClientId: config.googleClientId,
    });

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: response.idToken,
    });

    if (error) {
      throw new Error(error.message);
    }
    setUser(data.user);
    setSession(data.session);
  };

  const isAuthorized = !!user && !!session;

  return {
    user,
    session,
    modalOpen,
    setModalOpen,
    isAuthorized,
    login,
    register,
    logout,
    sendEmailOtp,
    verifyEmailWithOtp,
    appleSignIn,
    googleSignIn,
  };
};
