import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import RenderHtml from 'react-native-render-html';

interface NoteDisplayProps{
    title:string;
    content:string;
    onEdit?:()=>void;
}

const NoteDisplay = ({title,content,onEdit}:NoteDisplayProps) => {
    const {width} = useWindowDimensions();

  return (
    <View className='bg-background rounded-xl p-4 mb-4' >
      <View className='flex-row justify-between items-center ' >
        <Text className='text-text font-semibold text-lg' >{title ||'untitled note' }</Text>
        {onEdit && (
            <TouchableOpacity onPress={onEdit} className='p-1' >
                <Ionicons name='create' size={20} color='white' />
            </TouchableOpacity>
        )}
      </View>
      <View className="bg-background rounded-lg p-4 text-text  ">
        {content ? (
          <RenderHtml
            contentWidth={width - 48}
            source={{ html: content }}
            baseStyle={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 16,
              lineHeight: 1.6,
              color: '#ffffff',
            }}
          />
        ) : (
          <Text className="text-text italic">No content yet</Text>
        )}
      </View>
    </View>
  )
}

export default NoteDisplay