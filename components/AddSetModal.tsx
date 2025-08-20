import { useSetStore } from '@/store/setsStore';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddSetModal = ( {visible,onClose}:any) => {
    const [name,setName]= useState('');
    const [course,setCourse]=useState('');
    const {createSet}=useSetStore();

    const createset = async ()=>{
        if(!name){
            Alert.alert('name cannot be empty ')
            return;
        }
         const set = await createSet(name,course);
         if(set){
            onClose();
            setName('');
            setCourse('');
         }
    }
  return (
    <KeyboardAvoidingView className='flex-1' >
    <Modal 
     animationType='slide'
     transparent={true}
     visible={visible}
     onRequestClose={onClose}
    >
        <View className='flex-1 justify-end'>
        <View className='bg-secondary h-1/2 rounded-t-2xl' >
        
        <View className='flex-row justify-between items-center mx-5 mt-5 mb-5 '>
        <Text className='text-text text-2xl font-bold ' >Add Set</Text>
        <TouchableOpacity onPress={onClose}>
            <Text className='text-red-500 font-bold text-xl'>X</Text>
        </TouchableOpacity>
        </View>
        <View className='mb-4 mx-5 '>
        <TextInput
         placeholder='Set Name'
         value={name}
         onChangeText={setName}
         placeholderTextColor={'#a4a49c'}
         className='border border-border rounded-lg p-4 mt-5  text-text'
        />
        <TextInput
         placeholder='Course(optional)'
         value={course}
         onChangeText={setCourse}
         placeholderTextColor={'#a4a49c'}
         className='border border-border rounded-lg p-4 mt-5  text-text'
        />
        </View>
       
        
            <TouchableOpacity className='bg-primary rounded-2xl p-4 mt-5 mx-5' onPress={createset}>
                <Text className='text-text text-center font-bold text-lg' >Add</Text>
            </TouchableOpacity>
        
        
        </View>
        </View>
    </Modal>
    </KeyboardAvoidingView>
  )
}

export default AddSetModal
