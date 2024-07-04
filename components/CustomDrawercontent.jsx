import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import {Link, router} from 'expo-router'
import { View } from 'react-native'

export default function CustomDrawerContent() {

    return (
        <View style={{ flex: 1 }}>
        <DrawerContentScrollView >
            <DrawerItemList />
            <DrawerItem label={"Logout"} onPress={() => router.push('/sign-up')} />
  
        </DrawerContentScrollView>
        </View>
    )
}