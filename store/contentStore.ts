import { supabase } from "@/lib/supabase";
import * as FileSystem from 'expo-file-system';
import { Alert } from "react-native";
import { create } from "zustand";

export type ContentType = 'note'| 'pdf'|'image'|'flashcard'|'file';

export interface ContentItem{
    id:string;
    set_id:string;
    type:ContentType;
    title:string;
    text_content:string|null;
    file_path:string|null;
    flashcards:any[]|null;
    created_at:string;
}

interface ContentState{
    items: ContentItem[];
    currentItem:ContentItem|null;
    loading:boolean;
    error:string|null;

    fetchContent:(setId:string)=>Promise<void>;
    createNote:(setId:string,title:string,content:string)=>Promise<void>;
    updateNote:(id:string,title:string,content:string)=>Promise<void>;
    getNoteContent:(id:string)=>Promise<string>;
    uploadFile:(setId:string,fileUri:string,fileName:string,type:'pdf'|'image')=>Promise<void>;
    createFlashcard:(setId:string,title:string,cards:{question:string,answer:string}[])=>Promise<void>;
    updateContent:(id:string,updates:Partial<ContentItem>)=>Promise<void>;
    deleteContent:(id:string)=>Promise<void>;

    downloadFile:(filePath:string)=>Promise<string>;
    extractTextFromImage:(imageUri:string)=>Promise<string>;
}

export const useContentStore=create<ContentState>((set,get)=>({
    items:[],
    currentItem:null,
    loading:false,
    error:null,
    
    fetchContent:async(setId:string)=>{
        set({loading:true,error:null});
        try{
            const {data,error}=await supabase
                .from('study_content')
                .select('*')
                .eq('set_id',setId)
                .order('created_at',{ascending:false});
            if(error) throw error;
            set({items:data || []});
        }catch(error:any){
            set({error:error.message});
        }finally{
            set({loading:false});
        }
    },
    createNote:async(setId:string,title:string,content:string)=>{
        set({loading:true,error:null});
        try{
            const {data,error}=await supabase
                .from('study_content')
                .insert([{
                    set_id:setId,
                    type:'note',
                    title,
                    text_content:content
                }])
                .select('*')
                .single();
            console.log('created note',data,error)
            if(error) throw error;
            set((state)=>({
                items:[data,...state.items],
                loading:false
            }));
        }catch(error:any){
            console.log('create note error',error)
            set({error:error.message,loading:false});
        }
    },
    updateNote:async(id:string,title:string,content:string)=>{
        set({loading:true,error:null});
        try{
            const{data,error}= await supabase
                  .from('study_content')
                  .update({
                    title,
                    text_content:content
                  })
                  .eq('id',id)
                  .select('*')
                  .single();

            if(error) throw error;

            set((state)=>({
                items:state.items.map(item=>item.id===id?{...item,title,text_content:content}:item),
                loading:false
            }));
        }catch(error:any){
            set({error:error.message,loading:false});
        }
    },
        
    getNoteContent:async(id:string)=>{
        try{
            const {data,error}=await supabase
                .from('study_content')
                .select('text_content,title')
                .eq('id',id)
                .single();
            if(error) throw error;
             return data.text_content ||'';
        }catch(error:any){
            console.error('get note content error:',error);
            return '';

        }
    },
    uploadFile:async(setId:string,fileUri:string,fileName:string,type:'pdf'|'image')=>{
        set({loading:true,error:null});
        try{
            const {data:{user}}=await supabase.auth.getUser();
            if(!user) throw new Error('user not authenticated');
            const fileExt = fileName.split('.').pop();
            const timestamp = Date.now();
            const newFileName = `${user.id}/${setId}/${timestamp}.${fileExt}`;
            
            const {data:signedUrlData,error:signedUrlError}= await supabase
                              .storage
                              .from('study_files')
                              .createSignedUrl(newFileName,60*60*24*30);

            if (signedUrlError) throw signedUrlError;
            const uploadResult = await FileSystem.uploadAsync(
                signedUrlData.signedUrl,
                fileUri,
                {
                    httpMethod:'PUT',
                    uploadType:FileSystem.FileSystemUploadType.BINARY_CONTENT,
                    headers:{
                         "content-Type":type==='pdf'?'application/pdf':'image/jpeg',
                    },
                }
            );
            if(uploadResult.status!==200){
                throw new Error('failed to upload file');
            }


            // const fileBlob = await FileSystem.readAsStringAsync(fileUri,{encoding: FileSystem.EncodingType.Base64,});
            // const {error:uploadError}=await supabase.storage
            //     .from('study_files')
            //     .upload(newFileName,fileBlob,{
            //         contentType:type==='pdf'?'application/pdf':'image/jpeg',
            //     });

            // if(uploadError)throw uploadError;
            const {data,error:dbError}= await supabase 
                 .from('study_content')
                 .insert([{
                    set_id:setId,
                    type,
                    title:fileName,
                    file_path:newFileName
                 }])
                 .select('*')
                 .single();
                
            
            console.log('uploaded file',data,dbError);
            
            if(dbError)throw dbError;
            set((state)=>({
                items:[data,...state.items],
                loading:false
            }));
            //if its an image 
            if(type==='image'){
                get().extractTextFromImage(fileUri)
                  .then(text=>{
                    if (text){
                        get().updateContent(data.id,{text_content:text});

                    }
                  })
                  .catch(err =>console.log("ocr failed:",err));

            }
        }catch (error:any){
            set({error:error.message,loading:false});
        }
    },
    createFlashcard:async(setId:string,title:string,cards:{question:string,answer:string}[])=>{
        set({loading:true,error:null});
        try{
            const {data,error}=await supabase
                .from('study_content')
                .insert([{
                    set_id:setId,
                    type:'flashcard',
                    title,
                    flashcards:cards
                }])
                .select('*')
                .single();
            if(error)throw error;
            set((state)=>({
                items:[data,...state.items],
                loading:false
            }));
        }catch(error:any){
            set({error:error.message,loading:false});
        }
    },
    updateContent:async(id:string,updates:Partial<ContentItem>)=>{
        set({loading:true,error:null});
        try{
            const {data,error}=await supabase
                .from('study_content')
                .update(updates)
                .eq('id',id)
                .select('*')
                .single();
            if(error)throw error;
            set((state)=>({
                items:state.items.map(item=>item.id===id?{...item,...updates}:item),
                loading:false
            }));
        }catch(error:any){
            set({error:error.message,loading:false});
        }
    },
    deleteContent:async(id:string)=>{
        set({loading:true,error:null});
        try{
            const item = get().items.find(item=>item.id===id);
            if(item&& item.file_path){
                const {error:storageError} = await supabase.storage
                      .from('study_files')
                      .remove([item.file_path]);
             if(storageError)console.error('file deletion error:',storageError);
            }
            const {error}=await supabase
               .from('study_content')
               .delete()
               .eq('id',id);
            if(error)throw error;
            set((state)=>({
                items:state.items.filter(item=>item.id!==id),
                loading:false
            }));
        }catch(error:any){
            set({error:error.message,loading:false});
        }
    },
    downloadFile: async (filePath: string) => {
        try {
          const { data, error } = await supabase.storage
            .from('study_files')
            .download(filePath);
          
          if (error) throw error;
        
          return URL.createObjectURL(data);
        } catch (error) {
          console.error('Download error:', error);
          throw error;
        }
      },
      extractTextFromImage: async (imageUri: string) => {
        try {
        
          
          Alert.alert(
            'OCR Feature',
            'Text extraction from images will be available in the premium version',
            [{ text: 'OK' }]
          );
          
          return ''; 
        } catch (error) {
          console.error('OCR error:', error);
          return '';
        }
      }
    }));

