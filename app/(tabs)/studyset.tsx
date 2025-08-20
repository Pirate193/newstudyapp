import AddButton from '@/components/AddButton';
import AddSetModal from '@/components/AddSetModal';
import StudyCard from '@/components/StudyCard';
import { useAuthStore } from '@/store/authStore';
import { useSetStore } from '@/store/setsStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Studyset = () => {
  const {user} = useAuthStore();
  const {sets,loading,fetchSets}=useSetStore();
  const [modalVisible,setModalVisible]=useState(false);



  useEffect(()=>{
    if (user) fetchSets(user.id);
  },[user]);

  return (
    <SafeAreaView className='flex-1 bg-background' >
      <View  className='mt-5 mb-5' >
        <Text className='text-text  text-2xl font-bold text-center' >Study Set</Text>
      </View>
      {/* search button */}
      <View className='mx-5 border border-border rounded-full flex-row items-center px-8 py-1 relative mb-5 mt-5'  >
        <Ionicons name='search' size={24} color={'#a4a49c'} className='absolute left-3 top-2 mr-2 ' />
        <TextInput
         placeholder='search'
         className='p-2'
         
         placeholderTextColor={'#a4a49c'}
        />
      </View>
      {loading?(
        <View className='items-center justify-center flex-1' >
          <ActivityIndicator size='small' color='#077ca5'/>
        </View>
      ):sets.length===0?(
        <View className='items-center justify-center flex-1' >
          <Text className='text-text text-center mt-10' >No study sets found. Create your first one </Text>
        </View>
        
      ):(
        <FlatList 
          data={sets}
          keyExtractor={(item)=>item.id}
          renderItem={({item})=>
           <StudyCard set={item} onPress={()=>{router.push(`/studyset/${item.id}`)}}/>
          }
        />
      )}
      <AddButton onPress={()=>setModalVisible(true)} />
      <AddSetModal  visible={modalVisible} onClose={()=>setModalVisible(false)}/>
    </SafeAreaView>
  )
}

export default Studyset