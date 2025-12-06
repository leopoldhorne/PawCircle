"use client";
import { supabase } from "@/server/db/supabase-client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

export interface PetData {
  id: string;
  created_at: string;
  name: string;
  type: string;
  birthday: string;
  slug?: string;
}

interface AuthContextType {
  user: User | null;
  pet: PetData | null | undefined;
  userData: UserData | null | undefined,
  circleData: CircleData | null | undefined,
  isLoadingUserData: boolean,
  isLoadingCircleData: boolean,
  signOut: () => void;
}

const getPrimaryPetForUser = async (userData: UserData) => {
  const { data: pet_data, error: pet_error } = await supabase
    .from("users_pets")
    .select("*, pets(*)")
    .eq("user_id", userData.id)
    .maybeSingle();
  if (pet_error) {
    console.log("ERROR FINDING PET DATA:", pet_error.message);
    throw new Error(pet_error.message);
  }

  // console.log(pet_data.pets)

  return pet_data  ? pet_data.pets as PetData || null : null
};

export interface UserData {
  id: string,
  created_at: string,
  email: string,
  first_name: string,
  last_name: string,
  auth_id: string,
  country: string,
  stripe_account_id?: string | null,
  stripe_payouts_enabled: boolean,
  stripe_charges_enabled: boolean,
}

const getUserData = async (user: User) => {
  const { data: user_data, error: user_error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (user_error) {
    console.log("ERROR FINDING USER DATA:", user_error.message);
    throw new Error(user_error.message);
  }

  // console.log(user_data)
  return user_data as UserData || null
}

export interface CircleData {
  id: string,
  created_at: string,
  pet_id: string,
  visibility: string,
  tagline?: string | null,
  blurb?: string | null,
  support_blurb?: string | null,
  profile_image_url?: string | null,
  image_1_url?: string | null,
  image_2_url?: string | null,
  image_3_url?: string | null,
  image_1_prompt?: string | null,
  image_2_prompt?: string | null,
  image_3_prompt?: string | null,
  updated_at?: string | null,

}

const getCircleData = async (pet: PetData) => {
  const { data, error } = await supabase.from("circles").select("*").eq("pet_id", pet.id).maybeSingle()

  if (error) {
    console.log("CANT GET CIRCLE")
    throw new Error("CANT GET CIRCLE")
  }

  // console.log(data)

  return data as CircleData || null
  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe;
    };
  }, []);

  const signOut = () => {
    supabase.auth.signOut();
  };

  const { data: userData, isLoading: isLoadingUserData, error: userDataError } = useQuery({
    queryKey: ["userData", user?.id],
    queryFn: () => getUserData(user!),
    enabled: !!user,
    staleTime: 1000 * 60 * 60,
  })

  const { data: pet, isLoading: isLoadingPet } = useQuery({
    queryKey: ["currentPet", user?.id],
    queryFn: () => getPrimaryPetForUser(userData!),
    enabled: !!user && !!userData,
    staleTime: 1000 * 60 * 60,
  });

  const { data: circleData, isLoading: isLoadingCircleData, error: circleDataError } = useQuery({
    queryKey: ["circleData", user?.id],
    queryFn: () => getCircleData(pet!),
    enabled: !!pet && !!user,
    staleTime: 1000 * 60 * 60,
  })

  return (
    <AuthContext.Provider value={{ user, signOut, pet, userData, isLoadingUserData, circleData, isLoadingCircleData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.log("useAuth must be used within the Auth provider");
    throw new Error("useAuth must be used within the Auth provider");
  }

  return context;
};
