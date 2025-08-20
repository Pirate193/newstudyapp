import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FileItemProps{
    name:string;
    type:string;
    onPress:()=>void;
}

const FileItem = ({name,type,onPress}:FileItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex-row items-center p-3 bg-secondary rounded-lg mb-2'>
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