import { supabase } from "@/lib/supabase";
import { create } from "zustand";

interface StudySet{
    id:string;
    name:string;
    course?:string;
    created_at:string;

}

interface StudySetState{
    sets:StudySet[];
    loading:boolean;
    error: string | null;
    fetchSets:(userId:string)=>Promise<void>;
    createSet: (name: string, course?: string) => Promise<StudySet | null>;
    deleteSet:(id:string)=>Promise<void>;
}
export const useSetStore=create<StudySetState>((set)=>({
    sets:[],
    loading:false,
    error:null,

    fetchSets:async(userId:string)=>{
        set({loading:true,error:null});
        try{
            const {data,error}=await supabase
                .from('study_sets')
                .select('id,name,course,created_at')
                .eq('owner_id',userId)
                .order('created_at',{ascending:false})
            if(error){
                throw error
            }
            set({sets:data || []})
        }catch(error:any){
            set({error:error.message});
        }finally{
            set({loading:false});
        }
    },
    createSet: async (name, course) => {
        set({ loading: true });
        try {
          const user = supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');
          
          const { data, error } = await supabase
            .from('study_sets')
            .insert([{ name, course, owner_id: (await user).data.user?.id }])
            .select('id, name, course, created_at')
            .single();
          
          if (error) throw error;
          
          set((state) => ({ sets: [data, ...state.sets] }));
          return data;
        } catch (error:any) {
          set({ error: error.message });
          return null;
        } finally {
          set({ loading: false });
        }
      },
    deleteSet:async(id:string)=>{
        set({loading:true});
        try{
            const {error}= await supabase
               .from('study_sets')
               .delete()
               .eq('id',id);
            
            if(error) throw error;
            set((state)=>({sets:state.sets.filter(set=>set.id!==id)}));
        }catch(error:any){
            set({error:error.message});
        }finally{
            set({loading:false});
        }
    },
}))

