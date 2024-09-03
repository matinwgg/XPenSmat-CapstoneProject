  import {
    StyleSheet,
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Switch,
    Modal,
    Image,
    ActivityIndicator,
  } from 'react-native';
  import FeatherIcon from 'react-native-vector-icons/Feather';
  import { router } from "expo-router";
  import { signOut } from "../../../../lib/appwrite";
  import { useGlobalContext } from "../../../../context/GlobalProvider";
  import { Drawer } from 'expo-router/drawer'
  import { DrawerToggleButton } from '@react-navigation/drawer'
  import React, { useState, useEffect } from 'react';

  const Settings = () => {

    const [form, setForm] = useState({
      emailNotifications: true,
      pushNotifications: false,
  })

  const { user, setUser, setIsLoggedIn, location, setLocation, globalCurrency } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [mylocation, setMyLocation] = useState({
  //   mylocation: "accra, ghana ",
  // })
  const logout = async () => {
    setIsSubmitting(true)
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("(auth)/sign-in");
    } catch (error) {
      console.log("Appwrite service :: logOut() :: " + Error(error));
    } finally {
      setIsSubmitting(false)
    }
  };
  
    return (
      <>
      <Drawer.Screen 
      options={{
        title: "Settings",
        headerShown: false,
        headerLeft: () => <DrawerToggleButton />
      }}/>
    {/* Heading */}
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        <View style={styles.container}>
                <View style={styles.header}>
            <Text className="text-[#1F41BB] text-4xl font-mbold pl-5" style={styles.headerTitle}>
              Settings
            </Text>
          </View>

          {/* Main */}
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.section, { paddingTop: 4 }]}>
        <Text style={styles.sectionTitle}>Account</Text>

        {/* Profile */}
        <View style={styles.sectionBody}>
          <TouchableOpacity
            onPress={() => {
              router.push('/settings/profile')
            }}
            style={styles.profile}>
            <Image alt=""
              source={{
                uri: user?.avatar,
              }}
              style={styles.profileAvatar} />

            <View style={styles.profileBody}>
              <Text style={styles.profileName}>{user?.username}</Text>

              <Text style={styles.profileHandle}>{user?.email}</Text>
            </View>

            <FeatherIcon
              color="#bcbcbc"
              name="chevron-right"
              size={22} />
          </TouchableOpacity>
        </View>
      </View>

        {/* Preference section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.sectionBody}>
          {/* Location */}
          <View style={[styles.rowWrapper, styles.rowFirst]}>
            <TouchableOpacity
              onPress={() => router.push('/settings/location')}
              style={styles.row}>
              <Text style={styles.rowLabel}>Location</Text>

              <View style={styles.rowSpacer} />

              <Text style={styles.rowValue} className="pl-[160px]">{location.city}, {location.country}</Text>
              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={19} />
            </TouchableOpacity>
          </View>

          {/* Set currency */}
          <View style={styles.rowWrapper}>
            <TouchableOpacity
              onPress={() => router.push("/settings/currency") }
            style={styles.row}>
            <Text style={styles.rowLabel}>Currency</Text>

            <View style={styles.rowSpacer} />

            <Text style={styles.rowValue}>{globalCurrency.name}</Text>

              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={19} />
            </TouchableOpacity>
          </View>
          {/* Email notification */}
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Email Notifications</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={emailNotifications =>
                  setForm({ ...form, emailNotifications })
                }
                style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                value={form.emailNotifications} />
            </View>
          </View>
          {/* Push notification */}
          <View style={[styles.rowWrapper, styles.rowLast]}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Push Notifications</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={pushNotifications =>
                  setForm({ ...form, pushNotifications })
                }
                style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                value={form.pushNotifications} />
            </View>
          </View>
        </View>
      </View>

      {/* Resources section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resources</Text>
        <View style={styles.sectionBody}>
          {/* Account verification */}
          <View style={[styles.rowWrapper, styles.rowFirst]}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/settings/verify-email',
                  params: { email: user?.email }, // Pass the email as a parameter
                });                    
              }}
              style={styles.row}>

              <Text style={styles.rowLabel}>Account Verification status</Text>
              <View style={styles.rowSpacer} />
              <Text style={styles.rowValue}>verified</Text>

              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={19} />
            </TouchableOpacity>
          </View>
            {/* Contact us */}
          <View style={styles.rowWrapper}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/settings/contact-report-terms',
                  params: { type: 'contact' }, // Pass the email as a parameter
                });                    
              }}
              style={styles.row}>
              <Text style={styles.rowLabel}>Contact Us</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={19} />
            </TouchableOpacity>
          </View>
          {/* Report Bug */}
          <View style={styles.rowWrapper}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/settings/contact-report-terms',
                  params: { type: 'report' }, // Pass the email as a parameter
                });                    
              }}
              style={styles.row}>
              <Text style={styles.rowLabel}>Report Bug</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={19} />
            </TouchableOpacity>
          </View>
          {/* Terms & Privacy */}
          <View style={[styles.rowWrapper, styles.rowLast]}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/settings/contact-report-terms',
                  params: { type: 'terms' }, // Pass the email as a parameter
                });                    
              }}
              style={styles.row}>
              <Text style={styles.rowLabel}>Terms and Privacy</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={19} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Logout */}
      <View style={styles.section}>
        <View style={styles.sectionBody}>
          <View
            style={[
              styles.rowWrapper,
              styles.rowFirst,
              styles.rowLast,
              { alignItems: 'center' },
            ]}>
            <TouchableOpacity
              onPress={logout}
              style={styles.row}>
              { isSubmitting === true ? (
                <View className="flex-1 self-center items-center">
                    <ActivityIndicator size="small" color='red'/>
                  </View>
                ) : (
              <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
              Log Out
            </Text>
            )}  
                
            </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.contentFooter}>App Version 2.24 #50491</Text>
      </ScrollView>
    </View>
  </SafeAreaView>



      </>
    )
  }


  const styles = StyleSheet.create({
    container: {
      padding: 0,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    /** Header */
    header: {
      marginTop: 20,
      flexDirection: 'row',
      width: '100%',
    },
    headerTitle: {
      fontWeight: '600',
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      alignSelf: 'flex-start',
    },
    /** Content */
    content: {
      paddingHorizontal: 16,
    },
    contentFooter: {
      marginTop: 24,
      fontSize: 13,
      fontWeight: '500',
      textAlign: 'center',
      color: '#a69f9f',
    },
    /** Section */
    section: {
      paddingVertical: 12,
    },
    sectionTitle: {
      margin: 8,
      marginLeft: 12,
      fontSize: 13,
      letterSpacing: 0.33,
      fontWeight: '500',
      color: '#a69f9f',
      textTransform: 'uppercase',
    },
    sectionBody: {
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    /** Profile */
    profile: {
      padding: 12,
      backgroundColor: '#fff',
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 9999,
      marginRight: 12,
    },
    profileBody: {
      marginRight: 'auto',
    },
    profileName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#292929',
    },
    profileHandle: {
      marginTop: 2,
      fontSize: 16,
      fontWeight: '400',
      color: '#858585',
    },
    /** Row */
    row: {
      height: 44,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: 12,
    },
    rowWrapper: {
      paddingLeft: 16,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderColor: '#f0f0f0',
    },
    rowFirst: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    rowLabel: {
      fontSize: 16,
      letterSpacing: 0.24,
      color: '#000',
    },
    rowSpacer: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    rowValue: {
      fontSize: 16,
      fontWeight: '500',
      color: '#ababab',
      marginRight: 4,
    },
    rowLast: {
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    rowLabelLogout: {
      width: '100%',
      textAlign: 'center',
      fontWeight: '600',
      color: '#dc2626',
    },
    centeredView: {
      flex: 1,
      marginBottom: 90,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      width: 290,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      fontSize: 20,
      marginBottom: 20,
      textAlign: 'center',
    },
  });

  export default Settings