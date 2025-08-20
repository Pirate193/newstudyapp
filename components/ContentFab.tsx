import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface ContentFabProps{
    onAddMaterial:(type:'flashcard'|'file'|'note')=>void;
}

const ContentFab = ({onAddMaterial}:ContentFabProps) => {
    const [modalVisible,setModalVisible]=useState(false);

    const handleAddMaterial=(type:'flashcard'|'file'|'note')=>{
        setModalVisible(false);
        onAddMaterial(type);
    }

  return (
    <>
    <TouchableOpacity className='bg-primary absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-black/30' onPress={()=>setModalVisible(true)}>
        <Ionicons name='add' size={28} color='white' />
    </TouchableOpacity>

    {/* modal */}
    <Modal
    visible={modalVisible}
    transparent={true}
    animationType='slide'
    onRequestClose={()=>setModalVisible(false)}
    >
    <View className='flex-1 justify-end' >
        <View className='bg-secondary rounded-t-3xl p-6 h-1/2 ' >
            <Text className='text-text font-bold text-center mb-6' >
                Add material
            </Text>
            <TouchableOpacity className='py-4 items-start absolute top-4  right-4' onPress={()=>setModalVisible(false)}>
                <Text className='text-text font-bold text-lg'>x</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>handleAddMaterial('flashcard')} className='flex-row items-center p-4 bg-gray-500 rounded-xl mb-3' >
                <View className='w-10 h-10 rounded-full bg-primary justify-center items-center mr-4' >
                    <Ionicons name='albums' size={24} color='white' />
                </View>
                <Text  className='text-base font-medium ' >Create flashcard</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>handleAddMaterial('file')} className='flex-row items-center p-4 bg-gray-500 rounded-xl mb-3' >
                <View className='w-10 h-10 rounded-full bg-primary justify-center items-center mr-4' >
                    <Ionicons name='cloud-upload' size={24} color='white' />
                </View>
                <Text  className='text-base font-medium ' >Upload a file</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>handleAddMaterial('note')} className='flex-row items-center p-4 bg-gray-500 rounded-xl mb-3' >
                <View className='w-10 h-10 rounded-full bg-primary justify-center items-center mr-4' >
                    <Ionicons name='document-text' size={24} color='white' />
                </View>
                <Text  className='text-base font-medium ' >Create a note </Text>
            </TouchableOpacity>

        </View>
    </View>
    </Modal>
    </>
  )
}

export default ContentFab