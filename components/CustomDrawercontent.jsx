import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItem, DrawerItemList, ScrollView } from "@react-navigation/drawer";
import { router, useRouter } from "expo-router";
import { icons, images } from '../constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useRef } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import data from '../constants/list.json';

import {
    FontAwesome as FAIcon,
  } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
    const route = useRouter();
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { bottom } = useSafeAreaInsets();
    const sheetRef = useRef();

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace("(auth)/sign-in");
      };
    

    return (
        <View className="flex-1">
            <DrawerContentScrollView 
            {...props} 
            scrollEnabled={false}
            contentContainerStyle={{backgroundColor: ' #ACE1AF', paddingTop: 70}}
            >
                {/* <RBSheet
                    ref={sheetRef}
                    draggable
                    customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                    }}
                    customStyles={{
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    },
                    draggableIcon: {
                        width: 80,
                    },
                    }}>
                    <ScrollView>
                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 10, marginBottom: 20,}}>
                        {data.grids.map(grid => (
                        <TouchableOpacity
                            key={grid.icon}
                            onPress={() => refScrollable.current.close()}
                            style={styles.gridButtonContainer}>
                            <View
                            style={[styles.gridButton, {backgroundColor: grid.color}]}>
                            <FAIcon name={grid.icon} style={styles.gridIcon} />
                            </View>
                            <Text style={styles.gridLabel}>{grid.label}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                    </ScrollView>
                </RBSheet> */}

                <View className="pb-5 ml-3.5">
                    <Image className="w-[80px] h-[80px] rounded-[50px] self-start " source={images.profile_picture} /> 
                    <Text className="self-start font-pbold text-[18px] pt-2.5"> {user?.firstName.charAt(0).toUpperCase() + user?.firstName.slice(1).toLowerCase()} {user?.lastName.charAt(0).toUpperCase() + user?.lastName.slice(1).toLowerCase()}</Text>
                </View>
                <View className="bg-white pt-2.5">
                    <DrawerItemList {...props}/>
                    <DrawerItem label={''} onPress={() => route.replace('(drawer)/(auth)/sign-in')} />
                </View>
            </DrawerContentScrollView>
            <View className="" style={{ borderRadius: 20, borderTopColor: "#F5F5F5", borderTopWidth: 1.5, padding: 20, paddingBottom: 20 + bottom}}>
                <TouchableOpacity onPress={logout} className="flex-row items-center -ml-6 mb-4">
                    <FeatherIcon
                        color="#2b64e3"
                        name="share-2"
                        style={{
                            alignSelf: 'left',
                            marginLeft: 30
                            
                        }}
                        size={28} />                    
                    <Text className=" text-[20px] font-pregular ml-3">Share with a friend</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}} className="flex-row items-center -ml-6  ">
                    <FeatherIcon
                        color="#2b64e3"
                        name="log-out"
                        style={{
                            alignSelf: 'left',
                            marginLeft: 30
                        }}
                        size={30} />                     
                    <Text className=" text-[20px] font-pregular ml-3">Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
       
    )
}

const styles = StyleSheet.create({
     gridButtonContainer: {
    flexBasis: '25%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIcon: {
    fontSize: 30,
    color: 'white',
  },
  gridLabel: {
    fontSize: 14,
    paddingTop: 10,
    color: '#333',
  },
})