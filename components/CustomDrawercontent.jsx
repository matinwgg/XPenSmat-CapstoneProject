import { View, Text, Image, TouchableOpacity } from 'react-native'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { router, useRouter } from "expo-router";
import { icons, images } from '../constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import { toast } from "../lib/toast";

export default function CustomDrawerContent(props) {
    const route = useRouter();
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { bottom } = useSafeAreaInsets();

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        toast('Logged out');
        router.replace("(auth)/sign-in");
      };
    

    return (
        <View className="flex-1">
            <DrawerContentScrollView 
            {...props} 
            scrollEnabled={false}
            contentContainerStyle={{backgroundColor: ' #ACE1AF', paddingTop: 70}}
            >
                <View className="pb-5 ml-3.5">
                    <Image className="w-[80px] h-[80px] rounded-[50px] self-start " source={images.profile_picture} /> 
                    <Text className="self-start font-pbold text-[18px] pt-2.5">Matin Odoom</Text>
                </View>
                <View className="bg-white pt-2.5">
                    <DrawerItemList {...props}/>
                    <DrawerItem label={''} onPress={() => route.replace('(drawer)/(auth)/sign-in')} />
                </View>
            </DrawerContentScrollView>
            {/* <View className="" style={{ borderRadius: 10, borderTopColor: "#F5F5F5", borderTopWidth: 1, padding: 20, paddingBottom: 20 + bottom}}>
                <TouchableOpacity onPress={logout} className="flex-row items-center -ml-10 -my-10 ">
                    <Image className="self-start" size={24} source={icons.logout} resizeMode='contain'/>
                    <Text className=" text-[16px] font-pregular -ml-5">Log Out</Text>
                </TouchableOpacity>
            </View> */}
        </View>
       
    )
}