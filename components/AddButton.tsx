import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const AddButton = ({onPress}:any) => {
  return (
    <TouchableOpacity className='bg-primary rounded-full items-center justify-center w-14 h-14 absolute bottom-6 right-6 ' onPress={onPress}>
         <Text className='text-3xl text-text' >+</Text>
    </TouchableOpacity>
  )
}

export default AddButton
