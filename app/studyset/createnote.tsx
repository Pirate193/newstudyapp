import { useContentStore } from '@/store/contentStore';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { SafeAreaView } from 'react-native-safe-area-context';

const Createnote = () => {
  //lets now get sets id from the url parameter
  const {setId,noteId}= useLocalSearchParams();
  const richTextRef = useRef<RichEditor>(null);
  // now the state we will need 
  const [title,setTitle]=useState('');
  const [content,setContent]= useState('');
  const [isSaving,setIsSaving]= useState(false);
  const [isLoading,setIsLoading]=useState(false);
   
  const {createNote,updateNote,getNoteContent}= useContentStore();

  const isEditing = !!noteId;

  useEffect(()=>{
    if(isEditing){
      loadNoteContent();
    }
  },[noteId]);

  const loadNoteContent= async()=>{
    if(!noteId) return;
    setIsLoading(true);
    try{
      const noteContent = await getNoteContent(noteId as string);
      setContent(noteContent);
      setTitle('');
    }catch(error){
      Alert.alert('eror','Failed to load note content');
    }finally{
      setIsLoading(false);
    }
  }

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleSaveNote=async()=>{
    if(!title.trim()){
      Alert.alert('Error','please enter a title we are working to change this so you wont need a title ');
    return;
    }
  
  if(!content.trim()){
    Alert.alert('Error','please enter a content we are working to change this so you wont need a content ');
    return;
    
  }
  setIsSaving(true);
  try{
    if(isEditing){
      await updateNote(noteId as string,title,content);
    }else{
    await createNote(setId as string,title,content);
    }
    router.back();
  }catch(error){
    Alert.alert('Error','Failed to create note')
  }finally{
    setIsSaving(false);
  }

}

  if (isLoading){
    return(
      <View className='flex-1 items-center justify-center bg-background' >
        <ActivityIndicator size='small' color='#4caf50' />
        <Text className='text-text text-center text-lg'>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-background' >
      {/* header */}
      <View className='flex-row mx-2 items-center justify-between ' >
        <View className='flex-row items-center' >
        <TouchableOpacity  onPress={()=>router.back()} className='mx-2 p-2 items-center' >
        <Ionicons name='arrow-back' size={24} color='#4caf50' />
       </TouchableOpacity>
       <View className='ml-4' >
        <TextInput 
         value={title}
         onChangeText={setTitle}
         placeholder='Note title'
         placeholderTextColor={'#a4a49c'}
         className='text-text font-semibold p-2
         '
        />
       </View>
        </View>
       
       <View className='mr-2' >
       <TouchableOpacity onPress={handleSaveNote} className='bg-primary px-5 rounded-full py-2 items-center '>
        <Text className='text-text ' >Save</Text>
       </TouchableOpacity>
       </View>
      </View>
      {/* rich text editor */}
      <ScrollView className='flex-1' >
        <RichEditor
        ref={richTextRef}
        initialContentHTML={content}
        onChange={handleContentChange}
        placeholder='start writing your notes here..'
        className='flex-1 p-4'
        editorStyle={
          {
            backgroundColor:'#000000',
            color:'#ffffff',
            placeholderColor:'#a4a49c',
            contentCSSText:`font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            font-size:16px;
            line-height:1.6;
            `
          }
        }
        />

      </ScrollView>
      <KeyboardAvoidingView>
      <RichToolbar 
      editor={richTextRef}
      actions={[
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'bullet',
        'indent',
        'outdent',
        'insertImage',
        'insertLink',
        'undo',
        'redo',
      ]}
      selectedIconStyle={{
        backgroundColor:'#4caf50',
        
      }}
      iconTint='#333'
      className='bg-background border-t border-border p-2'      
      
      />
      </KeyboardAvoidingView>
     
   
    </SafeAreaView>
  )
}

export default Createnote