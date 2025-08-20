import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MaterialSectionProps{
    title:string;
    count:number;
    children:React.ReactNode;
    onAdd?:()=>void;
}

const MaterialSection = ({title,count,children,onAdd}:MaterialSectionProps) => {
  return (
    <View className='bg-secondary rounded-xl p-4 mb-4 shadow-sm shadow-black/5'>
      <View className='flex-row justify-between items-center mb-3'>
        <View className='flex-row items-center' >
           <Text className='text-lg font-semibold mr-2 text-text' >
            {title}
           </Text>
           <Text className='text-base text-text font-medium' >
            {count}
           </Text>

        </View>
        {
            onAdd &&(
                <TouchableOpacity  onPress={onAdd} className='p-1' >
                     <Ionicons name='add' size={20} color='white' />
                </TouchableOpacity>
            )
        }
      </View>
      {children}
    </View>
  )
}

export default MaterialSection

