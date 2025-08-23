import ContentFab from '@/components/ContentFab';
import EmptyState from '@/components/EmptyState';
import FileItem from '@/components/FileItem';
import MaterialSection from '@/components/MaterialSection';
import NoteDisplay from '@/components/NoteDisplay';
import { useContentStore } from '@/store/contentStore';
import { useSetStore } from '@/store/setsStore';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SetScreen = () => {
    const {id} = useLocalSearchParams();
    const {sets} = useSetStore();
    const {items,loading,fetchContent}=useContentStore();


    const studyset = sets.find(set=>set.id===id);

    useEffect(()=>{
        if(id) fetchContent(id as string);
    },[id]);
    if(!studyset){
        return (
            <View>
                <Text>Study set not found</Text>
            </View>
        );
    }
    const flashcard = items.filter(item=>item.type==='flashcard');
    const file = items.filter(item=>item.type==='file');
    const notes = items.filter(item=>item.type==='note');
    
    const handleAddMaterial =(type:'flashcard'|'file'|'note')=>{
        switch(type){
            case 'flashcard':
                router.push(`/studyset/createflashcard?setId=${id}`)
                break;
            case 'file':
                router.push(`/studyset/uploadfile?setId=${id}`)
                break;
            case 'note':
                router.push(`/studyset/createnote?setId=${id}`)
                break;
        }
    };
    const handleCreateFlashcard = () => router.push(`/studyset/createflashcard?setId=${id}`);
    const handleUploadFile = () => router.push(`/studyset/uploadfile?setId=${id}`);
    const handleCreateNote = () => router.push(`/studyset/createnote?setId=${id}`);

  return (
    <SafeAreaView  className='flex-1 bg-background ' >
        <ScrollView className='mx-2' >
        <View className='mt-5 mb-5 mx-5 p-2 items-center' >
        <Text className='text-text text-2xl font-extrabold' >{studyset?.name} </Text> 
        </View>
    
    {/* flashcard sections */}
    <MaterialSection 
    title='flashcards'
    count={flashcard.length}
    onAdd={()=>handleAddMaterial('flashcard')}
    >
     {flashcard.length === 0 ? (
            <EmptyState
              icon="albums"
              title="No flashcards yet"
              subtitle="Create your first one to begin your journey to memorization mastery."
              buttonText="Create flashcard"
              onPress={handleCreateFlashcard}
              color="#9c27b0"
            />
          ) : (
            // Render existing flashcards here
            flashcard.map(flashcard => (
              <Text key={flashcard.id}>Flashcard: {flashcard.title}</Text>
            ))
          )}
    </MaterialSection>

    <MaterialSection
     title='files'
     count={file.length}
     onAdd={()=>handleAddMaterial('file')}
    >
    {file.length === 0 ? (
            <EmptyState
              icon="document"
              title="No files yet"
              subtitle="Upload your first file to get started."
              buttonText="Upload a file"
              onPress={handleUploadFile}
              color="#2196f3"
            />
          ) : (
            // Render existing files
            file.map(file => (
              <FileItem
                key={file.id}
                name={file.title}
                type={file.type.toUpperCase()}
                onPress={() => console.log('Open file', file.id)}
              />
            ))
          )}
    </MaterialSection>
    <MaterialSection
          title="Notes"
          count={notes.length}
          onAdd={() => handleAddMaterial('note')}
        >
          {notes.length === 0 ? (
            <EmptyState
              icon="document-text"
              title="No notes yet"
              subtitle="Create your first note to capture your thoughts."
              buttonText="Create a note"
              onPress={handleCreateNote}
              color="#4caf50"
            />
          ) : (
            // Render existing notes
            notes.map(note => (
              <NoteDisplay 
              key={note.id}
              title={note.title}
              content={note.text_content || ''}
              />
              
            ))
          )}
        </MaterialSection>
        
    


        </ScrollView>
        <ContentFab onAddMaterial={handleAddMaterial}/>
    </SafeAreaView>
  )
}

export default SetScreen