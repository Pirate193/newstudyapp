import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StudyCardProps{
    onPress:()=>void;
    set:{
        id:string;
        name:string;
        course?:string;
        created_at:string;
    }
}

const StudyCard = ({set,onPress}:StudyCardProps) => {
  return (
    <TouchableOpacity className='bg-secondary rounded-2xl m-2 ' onPress={onPress} >
        <View className='p-4  ' >
            <Text className='text-text font-bold text-lg ' >{set.name}</Text>
            {set.course && <Text className='text-text text-base '>{set.course}</Text>}
            <Text className='text-text text-sm font-thin '>Created at:{new Date(set.created_at).toLocaleDateString()}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default StudyCard