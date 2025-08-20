import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface EmptyStateProps{
    icon:string;
    title:string;
    subtitle:string;
    buttonText:string;
    onPress:()=>void;
    color:string;
}

const EmptyState = ({icon,title,subtitle,buttonText,onPress,color}:EmptyStateProps) => {
  return (
    <View className='items-center p-5' >
        <Ionicons name={icon} size={48} color={color} className='mb-3 opacity-70' />
        <Text className='text-text text-base font-semibold mb-2 text-center' >
            {title}
        </Text>
        <Text className='text-sm text-gray-500 text-center mb-5 leading-5' >
            {subtitle}
        </Text>
        <TouchableOpacity className='bg-primary px-5 py-2.5 rounded-full'onPress={onPress}>
            <Text className='text-text text-sm font-medium' >{buttonText}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default EmptyState