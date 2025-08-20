import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';



interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isInitialized : boolean;
    
    signUp:(email: string,password:string,username:string)=>Promise<void>;
    signIn:(email:string, password:string)=>Promise<void>;
    signOut: ()=>Promise<void>;
    initialize:()=>Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set,get)=>({
            user:null,
            session: null,
            isLoading: false,
            isInitialized:false,

            initialize: async()=>{
               try{
                const {data:{session}}=await supabase.auth.getSession()
                set({
                    session,
                    user:session?.user?? null,
                    isInitialized:true,
                })
                //listen for auth changes 
                const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{
                    set({
                        session,
                        user:session?.user??null,
                    })
                })
               }catch(error){
                console.error('initialize error:',error)
                set({isInitialized:true})
               }
            },
            signUp:async(email:string,password:string,username:string)=>{
                set({isLoading:true});
                try{
                    const {data,error}= await supabase.auth.signUp({
                        email,
                        password,
                        options:{
                            data:{
                                user_name:username,
                            },
                        },
                    });
                    if (error) throw error;
                    if (!data.session)throw new Error('No session returned')

                    const {data:sessionData}=await supabase.auth.getSession()

                    set({
                     user:sessionData.session?.user??null,
                     session:sessionData.session??null,
                });
                }catch(error){
                   console.error('sign up error ',error)
                   throw error
                }finally{
                    set({isLoading:false})
                }
            },
            signIn:async(email:string,password:string)=>{
                try{
                    set({isLoading:true})
                    const {data,error}= await supabase.auth.signInWithPassword({
                        email,password,
                        
                    })
                    if (error) throw error
                    const {data:sessionData}=await supabase.auth.getSession()
                    set({
                        user:sessionData.session?.user ?? null,
                        session:sessionData.session??null
                    })
                    
                }catch(error){
                    console.error('sign in error occured',error);
                    throw error
                }finally{
                    set({isLoading:false})
                }
                
            },
            signOut: async()=>{
                try{
                    set({isLoading:true})
                    const {error} = await supabase.auth.signOut()
                    if (error) throw error
                    set({user:null,session:null})
                }catch(error){
                    console.error('sign out error:',error)
                    throw error
                }finally{
                    set({isLoading:false})
                }
            },
            
        }),
        {
            name:'auth-storage',
            storage:createJSONStorage(()=>AsyncStorage),
            partialize:(state)=>({
                user:state.user,
                session:state.session,
                isInitialized:state.isInitialized,
            }),
        }
    )
)