import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NoteItemProps{
    title:string;
    preview?:string;
    onPress:()=>void;
}

const NoteItem = ({title,preview,onPress}:NoteItemProps) => {
  return (
   <TouchableOpacity onPress={onPress} className='flex-row items-center p-3 bg-secondary rounded-lg mb-2'>
    <Ionicons name='document-text' size={24} color='#4caf50' />
    <View className='flex-1 ml-3 mr-2' >
        <Text className='text-base font-medium mb-1' >
            {title}
        </Text>
        {preview&&(
        <Text  className='text-sm text-text' >
        {preview}
         </Text>
        )}

        
    </View>
    <Ionicons name='chevron-forward' size={24} color='#6c757d'/>
   </TouchableOpacity>
  )
}

export default NoteItem