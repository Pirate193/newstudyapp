import { useContentStore } from '@/store/contentStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface FileItemProps{
    id:string;
    name:string;
    type:string;
    filePath:string;
}

const FileItem = ({id,name,type,filePath}:FileItemProps) => {
  const {downloadFile}= useContentStore();
  const handleOpenFile= async()=>{
    try{
      const fileuri = await downloadFile(filePath);
      if(fileuri){
        
      }
      Alert.alert('file ready',`file "${name}" is ready to open`)
    }catch(error){
      console.error('error opening file:',error);
      Alert.alert('error','failed to open file try again')
    }
  }
  return (
    <TouchableOpacity onPress={handleOpenFile} className='flex-row items-center p-3 bg-secondary rounded-lg mb-2'>
     <Ionicons name='document' size={24} color='white' />
     <View>
        <Text className='text-base font-medium mb-1'numberOfLines={1}>
            {name}
        </Text>
        <Text className='text-sm text-text'>
            {type}
        </Text>
     </View>
     <Ionicons name='chevron-forward' size={20} color={'white'}/>
    </TouchableOpacity>
  )
}

export default FileItem