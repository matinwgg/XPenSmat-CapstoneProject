import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card } from '../../../../components/Transaction';
import { recoverPwd,  verifyEmail } from '../../../../lib/appwrite';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import FeatherIcon from 'react-native-vector-icons/Feather';

const VerificationScreen = () => {
  const [heading, setHeading] = useState("Get Verified")
  const [subHeading, setSubHeading ] = useState("Will you like to verify your email?")
  const [buttonTitle, setButtonTitle] = useState("Contine")
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useGlobalContext()

  const CheckCircle = () => {
    return (
      <FeatherIcon
          name="check-circle"
          size={24}
          color="#2ecc71"
        />
    )
  }

  const handleContinue = () => {
    setIsLoading(true)
    if (recoverPwd.isUserVerified()) {
      setHeading("Verified")
      setSubHeading("You are already verified!")
      setButtonTitle("OK")
      setIsLoading(false)
      CheckCircle()
      return
    }
    try {
      recoverPwd.SendEmail().then((value) => {
        if (value) {
            setHeading("Verification email sent!")
            setSubHeading("We've sent you a verification link to your email. Tap on it to get verified.")
            setButtonTitle("OK")
            setIsLoading(false)
        } else {
            setHeading("Oops!")
            setSubHeading("An Error Occured")
            setButtonTitle("Try later")
            setIsLoading(false)
        }
        });
    } catch (error) {
    } 
  };


  return (
    
    <View style={{   flex: 1, justifyContent: 'center', alignItems: 'center',  marginTop: -50}}>
        <Card style={{ height: 200, width: 300}}>
          <View className="items-center">
            {recoverPwd.isUserVerified() && ( CheckCircle() )}
          </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginTop: 10, textAlign: 'center' }}>{heading}</Text>
      <Text style={{ fontSize: 17, marginBottom: 50, textAlign: 'center'  }}>{subHeading}</Text>
      <View className=" bg-[#007AFF]  justify-center rounded-lg">
        <TouchableOpacity
            onPress={handleContinue}
            style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 20 }}
            disabled={isLoading}
        >
        {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
        ) : (
            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center',  }}>{buttonTitle}</Text>
        )}
    </TouchableOpacity>
      </View>
      </Card>
    </View>
  );
};

export default VerificationScreen;
