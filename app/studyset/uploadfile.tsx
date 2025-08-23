import { useContentStore } from '@/store/contentStore';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const Uploadfile = () => {
  const {setId} = useLocalSearchParams();
  const [isUploading,setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const {uploadFile}= useContentStore();

   const handlePickDocument = async ()=>{
    try{
      const result = await DocumentPicker.getDocumentAsync({
        type:['application/pdf','image/*'],
        copyToCacheDirectory:true,
      });
      if (!result.canceled) {
        const file = result.assets[0];
        setSelectedFile(file);
      }
    }catch(error){
      Alert.alert('Error','failed try again');
    }
   };
   const handleUploadFile = async ()=>{
    if(!selectedFile){
      Alert.alert('error','please select a file first');
    return;
    }
    if(!setId){
      Alert.alert('error','study set not found');
      return;
    }
    setIsUploading(true);
    try{
      await uploadFile(
        setId as string,
        selectedFile.uri,
        selectedFile.name,
        getFileType(selectedFile.uri) as 'pdf' | 'image'
      );
      Alert.alert('success', 'file upload successfuly ',[
        {text:'OK',onPress:()=>router.back()}
      ])
    }catch(error){
      Alert.alert('error','failed to upload file try again')
    }finally{
      setIsUploading(false);
    }
   }
   const getFileType = (uri: string): 'pdf' | 'image' => {
    const extension = uri.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    return 'image'; // default everything else to image
  };
  


  return (
    <SafeAreaView className='bg-background flex-1 ' >
      <StatusBar style='light'/>
      {/* header */}
      <View className='flex-row  items-center p-2 ' >
         <TouchableOpacity onPress={()=>router.back()} className=''  >
          <Ionicons name='arrow-back' size={24} color='white' />
         </TouchableOpacity>
         <View  className='p-2 ml-28' >
         <Text className='text-text font-bold text-lg' >Upload file</Text>
         </View>
         
      </View>
      <View className='flex-1 mx-4' >
      <View className=' items-center mt-5' >
        <Text className='text-text  text-lg ' >Select a file</Text>
        <TouchableOpacity onPress={handlePickDocument} className='items-center mt-4 p-4 '>
          <Ionicons name='cloud-upload' size={48} color={'#4CAF50'} className='mb-4' />
          <Text className='text-text font-medium text-lg' >Upload file</Text>
          <Text className='text-text text-sm' >supported formats: PDF, JPEG, JPG, PNG</Text>
        </TouchableOpacity>
      </View>
      {selectedFile &&(
        <View className='items-center mt-5 mb-5' >
          <Text className='text-text text-sm' >selected file </Text>
          <View className='flex-row items-center justify-between mt-2' >
            <Ionicons 
            name={getFileType(selectedFile.uri)==='pdf'?'document':'image'}
            size={32}
            color='#4CAF50'
            />
            <View>
              <Text className='text-text font-medium text-lg ' >{selectedFile.name}</Text>
              <Text className='text-text text-sm' >
              {getFileType(selectedFile.uri).toUpperCase()} •{' '}
              {((selectedFile.size ?? 0) / 1024 / 1024).toFixed(2)} MB

              </Text>
            </View>
            <TouchableOpacity onPress={()=>setSelectedFile(null)}
             className='p-2'
            >
              <Ionicons name='close-circle' size={24} color='#4CAF50'/>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* upload button */}
      <TouchableOpacity onPress={handleUploadFile} className='bg-primary items-center py-4 rounded-lg mt-2 ' >
        {
          isUploading ?(
            <ActivityIndicator size='small' color={'#4CAF50'} />
          ):(
            <Text className='text-text font-medium' >
              upload file 
            </Text>
          )
        }
      </TouchableOpacity>
      {/* help message  */}
      <Text>
        upload files to access them any where
      </Text>
      </View>
    </SafeAreaView>
  )
}

export default Uploadfile